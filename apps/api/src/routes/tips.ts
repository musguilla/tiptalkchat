import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { prisma } from '@tiptalk/db';
import { transferTipsys } from '../lib/wallet.js';
import { InsufficientBalanceError } from '@tiptalk/economy';

const sendBody = z.object({
  amount: z.number().int().positive().max(100_000),
  targetType: z.enum(['message', 'media', 'room']),
  targetId: z.string(),
  roomId: z.string(),
  note: z.string().max(280).optional(),
  idempotencyKey: z.string().optional(),
});

export async function tipRoutes(app: FastifyInstance): Promise<void> {
  app.post('/', async (req, reply) => {
    const { userId } = await app.requireUser(req);
    const body = sendBody.parse(req.body);
    const idempotencyKey = body.idempotencyKey ?? randomUUID();

    // Resolve receiver based on target
    let receiverId: string | null = null;
    if (body.targetType === 'message') {
      const msg = await prisma.message.findUnique({ where: { id: body.targetId } });
      if (!msg) throw app.httpErrors.notFound('Target message not found');
      if (msg.roomId !== body.roomId) throw app.httpErrors.badRequest('Target/room mismatch');
      receiverId = msg.authorId;
    } else if (body.targetType === 'media') {
      const media = await prisma.mediaAsset.findUnique({ where: { id: body.targetId } });
      if (!media) throw app.httpErrors.notFound('Target media not found');
      receiverId = media.ownerId;
    } else {
      // tip-the-room → creator gets it
      const room = await prisma.room.findUnique({ where: { id: body.targetId } });
      if (!room) throw app.httpErrors.notFound('Target room not found');
      receiverId = room.creatorId;
    }

    if (!receiverId) throw app.httpErrors.badRequest('Target has no claimable receiver');
    if (receiverId === userId) throw app.httpErrors.badRequest('Cannot tip yourself');

    // Existing tip with same idempotency key → return it
    const existing = await prisma.tip.findUnique({ where: { idempotencyKey } });
    if (existing) {
      reply.code(200);
      return existing;
    }

    try {
      const tip = await prisma.$transaction(async (tx) => {
        const created = await tx.tip.create({
          data: {
            senderId: userId,
            receiverId: receiverId!,
            roomId: body.roomId,
            amount: body.amount,
            targetType: body.targetType,
            targetId: body.targetId,
            note: body.note,
            idempotencyKey,
          },
        });
        return created;
      });

      // Now run the ledger transfer (separate transaction, idempotent via key)
      await transferTipsys({
        senderUserId: userId,
        receiverUserId: receiverId,
        amount: body.amount,
        refType: 'tip',
        refId: tip.id,
        idempotencyKey: `tip:${tip.id}`,
      });

      reply.code(201);
      return tip;
    } catch (err) {
      if (err instanceof InsufficientBalanceError) {
        throw app.httpErrors.paymentRequired(err.message);
      }
      throw err;
    }
  });

  app.get('/by-room/:roomId', async (req) => {
    const roomId = (req.params as { roomId: string }).roomId;
    const tips = await prisma.tip.findMany({
      where: { roomId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        sender: { select: { id: true, displayName: true, avatarUrl: true } },
        receiver: { select: { id: true, displayName: true, avatarUrl: true } },
      },
    });
    return { tips };
  });
}
