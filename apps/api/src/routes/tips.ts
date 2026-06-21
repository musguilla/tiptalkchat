import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import Stripe from 'stripe';
import { prisma } from '@tiptalk/db';
import { transferTipsys } from '../lib/wallet.js';
import { InsufficientBalanceError, eurCentsToTipsys } from '@tiptalk/economy';
import { loadEnv } from '@tiptalk/config';

const sendBody = z.object({
  amount: z.number().int().positive().max(100_000),
  targetType: z.enum(['message', 'media', 'room']),
  targetId: z.string(),
  roomId: z.string(),
  note: z.string().max(280).optional(),
  idempotencyKey: z.string().optional(),
});

const GUEST_TIP_PACKAGES = [100, 500, 1000, 2000] as const; // 1€/5€/10€/20€ in cents

const guestCheckoutBody = z.object({
  eurCents: z.number().int().refine(
    (v) => GUEST_TIP_PACKAGES.includes(v as (typeof GUEST_TIP_PACKAGES)[number]),
    { message: 'Allowed amounts: 100, 500, 1000, 2000 cents' },
  ),
  targetType: z.enum(['message', 'media', 'room']),
  targetId: z.string(),
  roomId: z.string(),
  email: z.string().email(),
  note: z.string().max(280).optional(),
});

async function resolveTipTarget(
  app: FastifyInstance,
  targetType: 'message' | 'media' | 'room',
  targetId: string,
  roomId: string,
): Promise<{ receiverId: string }> {
  if (targetType === 'message') {
    const msg = await prisma.message.findUnique({ where: { id: targetId } });
    if (!msg) throw app.httpErrors.notFound('Target message not found');
    if (msg.roomId !== roomId) throw app.httpErrors.badRequest('Target/room mismatch');
    if (!msg.authorId) throw app.httpErrors.badRequest('Cannot tip a guest message');
    return { receiverId: msg.authorId };
  }
  if (targetType === 'media') {
    const media = await prisma.mediaAsset.findUnique({ where: { id: targetId } });
    if (!media) throw app.httpErrors.notFound('Target media not found');
    if (!media.ownerId) throw app.httpErrors.badRequest('Cannot tip ownerless media');
    return { receiverId: media.ownerId };
  }
  const room = await prisma.room.findUnique({ where: { id: targetId } });
  if (!room) throw app.httpErrors.notFound('Target room not found');
  return { receiverId: room.creatorId };
}

export async function tipRoutes(app: FastifyInstance): Promise<void> {
  const env = loadEnv();
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  // Guest tip: opens a Stripe Checkout that charges the guest directly in €
  // (1€/5€/10€/20€). On payment success the webhook creates the Tip record
  // and credits the receiver's wallet with the equivalent Tipsys (8 per €).
  app.post('/guest-checkout', async (req, reply) => {
    const body = guestCheckoutBody.parse(req.body);
    const { receiverId } = await resolveTipTarget(app, body.targetType, body.targetId, body.roomId);

    const room = await prisma.room.findUniqueOrThrow({ where: { id: body.roomId } });
    const tipsys = eurCentsToTipsys(body.eurCents);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: body.email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: body.eurCents,
            product_data: {
              name: `Propina en TipTalk (${tipsys} Tipsys)`,
              description: `Propina para sala /r/${room.slug}`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${env.PUBLIC_BASE_URL}/r/${room.slug}?tip=success&session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.PUBLIC_BASE_URL}/r/${room.slug}?tip=cancelled`,
      metadata: {
        kind: 'guest-tip',
        roomId: body.roomId,
        receiverId,
        targetType: body.targetType,
        targetId: body.targetId,
        tipsys: String(tipsys),
        eurCents: String(body.eurCents),
        senderEmail: body.email,
        note: body.note ?? '',
      },
    });

    reply.code(201);
    return { url: session.url, sessionId: session.id };
  });

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
