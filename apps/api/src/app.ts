import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import { ZodError } from 'zod';
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
import { contactRoutes } from './routes/contact.js';
import { userRoutes } from './routes/users.js';
import { adminRoutes } from './routes/admin.js';
import { adminCallRoutes } from './routes/admin-calls.js';
import { verificationRoutes } from './routes/verification.js';
import { authPlugin } from './plugins/auth.js';

/**
 * Build the allow-list of CORS origins from the configured WEB_URL plus its
 * www/apex sibling, optionally extended via ALLOWED_ORIGINS (comma-separated).
 *
 *   buildAllowedOrigins("https://tiptalk.chat") -> ["https://tiptalk.chat", "https://www.tiptalk.chat"]
 *   buildAllowedOrigins("https://www.tiptalk.chat") -> ["https://www.tiptalk.chat", "https://tiptalk.chat"]
 */
function buildAllowedOrigins(webUrl: string, extra?: string): string[] {
  const out = new Set<string>();
  out.add(webUrl);
  try {
    const u = new URL(webUrl);
    if (u.hostname.startsWith('www.')) {
      u.hostname = u.hostname.replace(/^www\./, '');
      out.add(u.toString().replace(/\/$/, ''));
    } else {
      u.hostname = `www.${u.hostname}`;
      out.add(u.toString().replace(/\/$/, ''));
    }
  } catch {
    /* keep webUrl only */
  }
  if (extra) {
    for (const o of extra.split(',').map((s) => s.trim()).filter(Boolean)) out.add(o);
  }
  return [...out];
}

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
  // Accept the configured WEB_URL plus its www / apex sibling so the API
  // works whether the canonical domain has the 'www.' prefix or not. Extra
  // origins (e.g. preview deploys) can be added via the comma-separated
  // ALLOWED_ORIGINS env var.
  const allowedOrigins = buildAllowedOrigins(env.WEB_URL, process.env.ALLOWED_ORIGINS);
  await app.register(cors, {
    origin: allowedOrigins,
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

  // Zod validation failures (`schema.parse(req.body)`) used to surface as
  // 500s because Fastify doesn't know what a ZodError is. Map them to a 400
  // with the first issue's path+message so clients get something actionable.
  // Errors that already carry a statusCode (sensible's httpErrors, Fastify's
  // own) pass through untouched; everything else stays a 500.
  app.setErrorHandler((error, req, reply) => {
    if (error instanceof ZodError) {
      const first = error.issues[0];
      const where = first?.path.length ? `${first.path.join('.')}: ` : '';
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: `${where}${first?.message ?? 'Invalid request'}`,
        issues: error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      });
    }
    const status = typeof error.statusCode === 'number' ? error.statusCode : 500;
    if (status >= 500) req.log.error(error);
    return reply.status(status).send({
      statusCode: status,
      error: error.name ?? 'Error',
      message: status >= 500 && env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message,
    });
  });

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
  await app.register(contactRoutes, { prefix: '/contact' });
  await app.register(userRoutes, { prefix: '/users' });
  await app.register(adminRoutes, { prefix: '/admin' });
  await app.register(adminCallRoutes, { prefix: '/admin/calls' });
  await app.register(verificationRoutes, { prefix: '/verification' });

  return app;
}
