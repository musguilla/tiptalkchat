import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

const contactBody = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email().max(120),
  subject: z.string().min(1).max(120),
  message: z.string().min(1).max(4000),
});

/**
 * Contact-form drop. Stores nothing — just logs the message server-side
 * so it shows up in the API logs/error reporting (Railway → Logs). Good
 * enough until we wire a transactional email or a ticketing system.
 *
 * Rate-limit comes from the global preHandler; no auth required.
 */
export async function contactRoutes(app: FastifyInstance): Promise<void> {
  app.post('/', async (req, reply) => {
    const body = contactBody.parse(req.body);
    // eslint-disable-next-line no-console
    console.info(
      `[contact] ${body.email} <${body.name}> · ${body.subject}\n${body.message}`,
    );
    reply.code(202);
    return { ok: true };
  });
}
