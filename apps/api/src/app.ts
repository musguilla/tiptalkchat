import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import { loadEnv } from '@tiptalk/config';
import { authRoutes } from './routes/auth.js';
import { roomRoutes } from './routes/rooms.js';
import { messageRoutes } from './routes/messages.js';
import { walletRoutes } from './routes/wallet.js';
import { tipRoutes } from './routes/tips.js';
import { purchaseRoutes } from './routes/purchases.js';
import { payoutRoutes } from './routes/payouts.js';
import { connectRoutes } from './routes/connect.js';
import { stripeWebhookRoute } from './routes/stripe-webhook.js';
import { muxWebhookRoute } from './routes/mux-webhook.js';
import { mediaRoutes } from './routes/media.js';
import { callTokenRoutes } from './routes/calls.js';
import { authPlugin } from './plugins/auth.js';

export async function buildApp(): Promise<FastifyInstance> {
  const env = loadEnv();
  const app = Fastify({
    logger:
      env.NODE_ENV === 'test'
        ? false
        : {
            level: env.LOG_LEVEL,
            transport:
              env.NODE_ENV === 'development'
                ? { target: 'pino-pretty', options: { translateTime: 'HH:MM:ss', colorize: true } }
                : undefined,
          },
    trustProxy: true,
    // Stripe webhooks require the raw body, so we set rawBody on a per-route basis.
    bodyLimit: env.MAX_MEDIA_BYTES,
  });

  await app.register(sensible);
  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, {
    origin: [env.WEB_URL],
    credentials: true,
  });
  await app.register(rateLimit, {
    max: env.RATE_LIMIT_PER_MIN,
    timeWindow: '1 minute',
  });
  await app.register(jwt, {
    secret: env.JWT_ACCESS_SECRET,
  });
  await app.register(authPlugin);

  app.get('/healthz', async () => ({ ok: true, ts: Date.now() }));

  await app.register(stripeWebhookRoute, { prefix: '/webhooks/stripe' });
  await app.register(muxWebhookRoute, { prefix: '/webhooks/mux' });

  await app.register(authRoutes, { prefix: '/auth' });
  await app.register(roomRoutes, { prefix: '/rooms' });
  await app.register(messageRoutes, { prefix: '/messages' });
  await app.register(mediaRoutes, { prefix: '/media' });
  await app.register(callTokenRoutes, { prefix: '/calls' });
  await app.register(walletRoutes, { prefix: '/wallet' });
  await app.register(tipRoutes, { prefix: '/tips' });
  await app.register(purchaseRoutes, { prefix: '/purchases' });
  await app.register(payoutRoutes, { prefix: '/payouts' });
  await app.register(connectRoutes, { prefix: '/connect' });

  return app;
}
