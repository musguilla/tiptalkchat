import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@tiptalk/db';
import { getStorage } from '../lib/storage.js';
import { canRequestPayout, PAYOUT_MIN_TIPSYS } from '@tiptalk/economy';

/**
 * Profile + gallery endpoints. Everything here requires auth — the
 * profile page is private.
 */

const galleryUploadBody = z.object({
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  bytes: z.number().int().positive().max(10 * 1024 * 1024),
  isPublic: z.boolean().default(false),
});

const updatePhotoBody = z.object({
  isPublic: z.boolean(),
});

export async function userRoutes(app: FastifyInstance): Promise<void> {
  app.get('/:id', async (req) => {
    await app.requireUser(req);
    const id = (req.params as { id: string }).id;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, displayName: true, avatarUrl: true, createdAt: true },
    });
    if (!user) throw app.httpErrors.notFound('User not found');
    return user;
  });

  /**
   * Public-facing gallery for a profile. Owner sees everything (with
   * isPublic flag). Other viewers see all photos but server only marks
   * which are public — the web treats private ones as blurred placeholders.
   * We still return the URLs for non-owner so the blur layer can sit on
   * top; if you want stronger privacy later we can return placeholders.
   */
  app.get('/:id/photos', async (req) => {
    const me = await app.requireUser(req);
    const id = (req.params as { id: string }).id;
    const isSelf = me.userId === id;
    const photos = await prisma.profilePhoto.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, publicUrl: true, isPublic: true, createdAt: true },
    });
    return {
      photos: photos.map((p) => ({
        id: p.id,
        url: p.publicUrl,
        isPublic: p.isPublic,
        createdAt: p.createdAt,
        // Hide the URL on private photos when viewer is not the owner.
        // The web shows a blurred placeholder instead.
        viewerCanSee: isSelf || p.isPublic,
      })),
    };
  });

  /**
   * Everything the owner of a profile needs to see about their own money, in
   * a single round-trip: balance, payout eligibility, Connect state, payout
   * history, recent ledger movements and tip totals. The self-view of
   * /u/[id] renders straight from this.
   */
  app.get('/me/overview', async (req) => {
    const { userId } = await app.requireUser(req);

    const [wallet, connect, payouts, recentLedger, tipsReceived, tipsSent] =
      await Promise.all([
        prisma.wallet.findUnique({ where: { userId }, select: { balance: true } }),
        prisma.connectAccount.findUnique({
          where: { userId },
          select: { status: true, payoutsEnabled: true, createdAt: true },
        }),
        prisma.payoutRequest.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: {
            id: true,
            tipsys: true,
            grossEurCents: true,
            feeEurCents: true,
            netEurCents: true,
            status: true,
            failureReason: true,
            createdAt: true,
            paidAt: true,
          },
        }),
        prisma.ledgerEntry.findMany({
          where: { wallet: { userId } },
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: { id: true, kind: true, amount: true, balanceAfter: true, createdAt: true },
        }),
        prisma.tip.aggregate({
          where: { receiverId: userId },
          _count: { _all: true },
          _sum: { amount: true },
        }),
        prisma.tip.aggregate({
          where: { senderId: userId },
          _count: { _all: true },
          _sum: { amount: true },
        }),
      ]);

    const balance = wallet?.balance ?? 0;
    return {
      wallet: {
        balance,
        payoutMin: PAYOUT_MIN_TIPSYS,
        canRequestPayout: canRequestPayout(balance),
      },
      connect: connect
        ? {
            connected: true,
            status: connect.status,
            payoutsEnabled: connect.payoutsEnabled,
            connectedAt: connect.createdAt,
          }
        : { connected: false, status: null, payoutsEnabled: false, connectedAt: null },
      payouts,
      recentLedger,
      tips: {
        received: { count: tipsReceived._count._all, tipsys: tipsReceived._sum.amount ?? 0 },
        sent: { count: tipsSent._count._all, tipsys: tipsSent._sum.amount ?? 0 },
      },
    };
  });

  /**
   * Sign an upload URL for a new gallery photo. The client then PUTs the
   * bytes directly to storage and follows up with POST /users/me/photos
   * to register the row in DB.
   */
  app.post('/me/photos/upload', async (req, reply) => {
    const me = await app.requireUser(req);
    const body = galleryUploadBody.parse(req.body);
    const storage = getStorage();
    const ticket = await storage.createGalleryUploadTicket({
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
      publicUrl: ticket.publicUrl,
      storageKey: ticket.storageKey,
    };
  });

  /**
   * Register a freshly-uploaded gallery photo. Called after the client
   * PUT to storage succeeded.
   */
  app.post('/me/photos', async (req, reply) => {
    const me = await app.requireUser(req);
    const body = z
      .object({
        publicUrl: z.string().url(),
        storageKey: z.string().min(1),
        isPublic: z.boolean().default(false),
      })
      .parse(req.body);
    const photo = await prisma.profilePhoto.create({
      data: {
        userId: me.userId,
        publicUrl: body.publicUrl,
        storageKey: body.storageKey,
        isPublic: body.isPublic,
      },
    });
    reply.code(201);
    return {
      id: photo.id,
      url: photo.publicUrl,
      isPublic: photo.isPublic,
      createdAt: photo.createdAt,
    };
  });

  app.patch('/me/photos/:id', async (req) => {
    const me = await app.requireUser(req);
    const id = (req.params as { id: string }).id;
    const body = updatePhotoBody.parse(req.body);
    const owned = await prisma.profilePhoto.findFirst({
      where: { id, userId: me.userId },
    });
    if (!owned) throw app.httpErrors.notFound('Photo not found');
    const updated = await prisma.profilePhoto.update({
      where: { id },
      data: { isPublic: body.isPublic },
    });
    return {
      id: updated.id,
      url: updated.publicUrl,
      isPublic: updated.isPublic,
      createdAt: updated.createdAt,
    };
  });

  app.delete('/me/photos/:id', async (req, reply) => {
    const me = await app.requireUser(req);
    const id = (req.params as { id: string }).id;
    const owned = await prisma.profilePhoto.findFirst({
      where: { id, userId: me.userId },
    });
    if (!owned) throw app.httpErrors.notFound('Photo not found');
    const storage = getStorage();
    await storage.deleteObject(owned.storageKey);
    await prisma.profilePhoto.delete({ where: { id } });
    reply.code(204);
    return null;
  });
}
