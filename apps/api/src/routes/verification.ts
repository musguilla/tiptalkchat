import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@tiptalk/db';
import { getStorage } from '../lib/storage.js';

/**
 * Age-verification flow for creators who want to monetize. A user uploads an
 * ID document (and a selfie) to a PRIVATE bucket, then submits. An admin
 * reviews and approves/rejects. Monetization (connecting a wallet / receiving
 * payouts) is gated on `User.ageStatus === 'verified'`.
 */

const uploadBody = z.object({
  kind: z.enum(['document', 'selfie']),
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  bytes: z.number().int().positive().max(15 * 1024 * 1024),
});

const submitBody = z.object({
  documentKey: z.string().min(1),
  selfieKey: z.string().min(1).optional(),
  declaredAdult: z.literal(true),
});

export async function verificationRoutes(app: FastifyInstance): Promise<void> {
  // Current user's age-verification state + latest submission.
  app.get('/me', async (req) => {
    const me = await app.requireUser(req);
    const [user, latest] = await Promise.all([
      prisma.user.findUnique({
        where: { id: me.userId },
        select: { ageStatus: true, ageVerifiedAt: true },
      }),
      prisma.ageVerification.findFirst({
        where: { userId: me.userId },
        orderBy: { submittedAt: 'desc' },
        select: { id: true, status: true, submittedAt: true, reviewedAt: true, rejectionReason: true },
      }),
    ]);
    return {
      status: user?.ageStatus ?? 'none',
      verifiedAt: user?.ageVerifiedAt ?? null,
      latest,
    };
  });

  // Sign a private upload URL for a verification document. The client PUTs the
  // bytes and then calls /submit with the returned storageKey.
  app.post('/upload', async (req, reply) => {
    const me = await app.requireUser(req);
    const body = uploadBody.parse(req.body);
    const storage = getStorage();
    const ticket = await storage.createVerificationUploadTicket({
      contentType: body.contentType,
      bytes: body.bytes,
      userId: me.userId,
    });
    reply.code(201);
    return {
      upload: {
        url: ticket.uploadUrl,
        method: ticket.method,
        headers: ticket.headers,
        expiresInSec: ticket.expiresInSec,
      },
      storageKey: ticket.storageKey,
    };
  });

  // Submit for review. Requires an explicit 18+ declaration.
  app.post('/submit', async (req, reply) => {
    const me = await app.requireUser(req);
    const body = submitBody.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: me.userId },
      select: { ageStatus: true },
    });
    if (user?.ageStatus === 'verified') {
      throw app.httpErrors.badRequest('Tu cuenta ya está verificada');
    }

    const record = await prisma.$transaction(async (tx) => {
      const rec = await tx.ageVerification.create({
        data: {
          userId: me.userId,
          documentKey: body.documentKey,
          selfieKey: body.selfieKey,
          declaredAdult: true,
          status: 'pending',
        },
        select: { id: true, status: true, submittedAt: true },
      });
      await tx.user.update({ where: { id: me.userId }, data: { ageStatus: 'pending' } });
      return rec;
    });

    reply.code(201);
    return record;
  });
}
