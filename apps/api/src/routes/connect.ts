import type { FastifyInstance } from 'fastify';
import Stripe from 'stripe';
import { prisma } from '@tiptalk/db';
import { loadEnv } from '@tiptalk/config';

export async function connectRoutes(app: FastifyInstance): Promise<void> {
  const env = loadEnv();
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  app.post('/onboard', async (req, reply) => {
    const { userId } = await app.requireUser(req);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    let connect = await prisma.connectAccount.findUnique({ where: { userId } });
    if (!connect) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: user.email,
        capabilities: { transfers: { requested: true } },
      });
      connect = await prisma.connectAccount.create({
        data: { userId, stripeAccountId: account.id, status: 'onboarding' },
      });
    }

    const link = await stripe.accountLinks.create({
      account: connect.stripeAccountId,
      refresh_url: `${env.PUBLIC_BASE_URL}/wallet?connect=refresh`,
      return_url: `${env.PUBLIC_BASE_URL}/wallet?connect=done`,
      type: 'account_onboarding',
    });

    reply.code(201);
    return { url: link.url, accountId: connect.stripeAccountId };
  });

  app.get('/status', async (req) => {
    const { userId } = await app.requireUser(req);
    const connect = await prisma.connectAccount.findUnique({ where: { userId } });
    if (!connect) return { connected: false };
    return {
      connected: true,
      status: connect.status,
      payoutsEnabled: connect.payoutsEnabled,
    };
  });
}
