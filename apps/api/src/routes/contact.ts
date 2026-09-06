import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@tiptalk/db';

const contactBody = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email().max(120),
  subject: z.string().min(1).max(120),
  message: z.string().min(1).max(4000),
});

/**
 * Contact-form drop. Persists to ContactMessage so the admin panel can
 * triage (new → read → archived), and also logs so it shows up in Railway
 * logs as a fallback. No auth required.
 */
export async function contactRoutes(app: FastifyInstance): Promise<void> {
  app.post('/', async (req, reply) => {
    const body = contactBody.parse(req.body);
    await prisma.contactMessage.create({ data: body });
    // eslint-disable-next-line no-console
    console.info(`[contact] ${body.email} <${body.name}> · ${body.subject}`);
    reply.code(202);
    return { ok: true };
  });
}
