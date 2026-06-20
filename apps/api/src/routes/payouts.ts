import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { prisma } from '@tiptalk/db';
import {
  PAYOUT_MIN_TIPSYS,
  assertCanRequestPayout,
  InsufficientTipsysForPayoutError,
  quotePayout,
} from '@tiptalk/economy';
import { appendLedgerEntry, getOrCreateWallet } from '../lib/wallet.js';
import { loadEnv } from '@tiptalk/config';

const requestBody = z.object({
  tipsys: z.number().int().positive(),
});

export async function payoutRoutes(app: FastifyInstance): Promise<void> {
  const env = loadEnv();

  app.get('/quote', async (req) => {
    const tipsys = Number((req.query as { tipsys?: string }).tipsys ?? PAYOUT_MIN_TIPSYS);
    const quote = quotePayout(tipsys, env.PLATFORM_FEE_PCT);
    return { ...quote, min: PAYOUT_MIN_TIPSYS };
  });

  app.post('/', async (req, reply) => {
    const { userId } = await app.requireUser(req);
    const body = requestBody.parse(req.body);
    const wallet = await getOrCreateWallet(userId);

    try {
      assertCanRequestPayout(body.tipsys);
    } catch (err) {
      if (err instanceof InsufficientTipsysForPayoutError) {
        throw app.httpErrors.badRequest(err.message);
      }
      throw err;
    }
    if (wallet.balance < body.tipsys) {
      throw app.httpErrors.paymentRequired(
        `Insufficient Tipsys: have ${wallet.balance}, need ${body.tipsys}`,
      );
    }

    const connect = await prisma.connectAccount.findUnique({ where: { userId } });
    if (!connect || !connect.payoutsEnabled) {
      throw app.httpErrors.preconditionFailed(
        'Stripe Connect account required and KYC must be verified before requesting payout',
      );
    }

    const quote = quotePayout(body.tipsys, env.PLATFORM_FEE_PCT);
    const payoutId = randomUUID();

    const payout = await prisma.$transaction(async (tx) => {
      const created = await tx.payoutRequest.create({
        data: {
          id: payoutId,
          userId,
          tipsys: body.tipsys,
          grossEurCents: quote.grossEurCents,
          feeEurCents: quote.feeEurCents,
          netEurCents: quote.netEurCents,
          feePct: quote.feePct,
          status: 'requested',
        },
      });
      // Debit the wallet immediately (held until Stripe transfer succeeds)
      await appendLedgerEntry({
        walletId: wallet.id,
        kind: 'PAYOUT_DEBIT',
        amount: -body.tipsys,
        idempotencyKey: `payout:${payoutId}:debit`,
        refType: 'payout',
        refId: payoutId,
        tx,
      });
      return created;
    });

    // In production: kick off a Stripe transfer to connect.stripeAccountId.
    // For now, the payout sits in `requested` and is moved by an admin or by
    // the Stripe webhook (`transfer.paid`) handler.

    reply.code(201);
    return payout;
  });

  app.get('/', async (req) => {
    const { userId } = await app.requireUser(req);
    const list = await prisma.payoutRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return { payouts: list };
  });
}
