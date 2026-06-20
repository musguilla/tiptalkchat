import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import Stripe from 'stripe';
import { prisma } from '@tiptalk/db';
import { listPackages, tipsysForPurchase } from '@tiptalk/economy';
import { loadEnv } from '@tiptalk/config';

const createBody = z.object({
  eurCents: z.number().int().positive().max(100_000),
});

export async function purchaseRoutes(app: FastifyInstance): Promise<void> {
  const env = loadEnv();
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  app.get('/packages', async () => ({ packages: listPackages() }));

  app.post('/checkout', async (req, reply) => {
    const { userId } = await app.requireUser(req);
    const body = createBody.parse(req.body);
    const tipsys = tipsysForPurchase(body.eurCents);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: body.eurCents,
            product_data: {
              name: `${tipsys} Tipsys`,
              description: `Compra de ${tipsys} Tipsys para TipTalk`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${env.PUBLIC_BASE_URL}/wallet?purchase=success&session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.PUBLIC_BASE_URL}/wallet?purchase=cancelled`,
      metadata: {
        userId,
        tipsys: String(tipsys),
        eurCents: String(body.eurCents),
      },
    });

    await prisma.purchase.create({
      data: {
        userId,
        stripeSessionId: session.id,
        eurCents: body.eurCents,
        tipsys,
        status: 'pending',
      },
    });

    reply.code(201);
    return { sessionId: session.id, url: session.url };
  });

  app.get('/', async (req) => {
    const { userId } = await app.requireUser(req);
    const purchases = await prisma.purchase.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return { purchases };
  });
}
