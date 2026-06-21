import type { FastifyInstance } from 'fastify';
import { prisma } from '@tiptalk/db';
import { canRequestPayout, PAYOUT_MIN_TIPSYS } from '@tiptalk/economy';
import { getOrCreateGuestWallet, getOrCreateWallet } from '../lib/wallet.js';

export async function walletRoutes(app: FastifyInstance): Promise<void> {
  app.get('/', async (req) => {
    const actor = await app.requireActor(req);
    const wallet =
      actor.kind === 'user'
        ? await getOrCreateWallet(actor.userId)
        : await getOrCreateGuestWallet(actor.guestId);
    return {
      balance: wallet.balance,
      payoutMin: PAYOUT_MIN_TIPSYS,
      // Guests can't payout — only verified users.
      canRequestPayout: actor.kind === 'user' && canRequestPayout(wallet.balance),
      isGuest: actor.kind === 'guest',
    };
  });

  app.get('/ledger', async (req) => {
    const actor = await app.requireActor(req);
    const wallet =
      actor.kind === 'user'
        ? await prisma.wallet.findUnique({ where: { userId: actor.userId } })
        : await prisma.wallet.findUnique({ where: { guestId: actor.guestId } });
    if (!wallet) return { entries: [] };
    const entries = await prisma.ledgerEntry.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return { entries };
  });
}
