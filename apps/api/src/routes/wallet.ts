import type { FastifyInstance } from 'fastify';
import { prisma } from '@tiptalk/db';
import { canRequestPayout, PAYOUT_MIN_TIPSYS } from '@tiptalk/economy';
import { getOrCreateWallet } from '../lib/wallet.js';

export async function walletRoutes(app: FastifyInstance): Promise<void> {
  app.get('/', async (req) => {
    const { userId } = await app.requireUser(req);
    const wallet = await getOrCreateWallet(userId);
    return {
      balance: wallet.balance,
      payoutMin: PAYOUT_MIN_TIPSYS,
      canRequestPayout: canRequestPayout(wallet.balance),
    };
  });

  app.get('/ledger', async (req) => {
    const { userId } = await app.requireUser(req);
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) return { entries: [] };
    const entries = await prisma.ledgerEntry.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return { entries };
  });
}
