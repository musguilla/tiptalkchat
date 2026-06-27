import type { FastifyInstance } from 'fastify';
import { prisma } from '@tiptalk/db';

/**
 * Profile endpoint. Auth-gated: only logged-in users can fetch other
 * profiles. Anonymous visitors get 401 and the web app pivots to a
 * 'Inicia sesión' screen.
 */
export async function userRoutes(app: FastifyInstance): Promise<void> {
  app.get('/:id', async (req) => {
    await app.requireUser(req);
    const id = (req.params as { id: string }).id;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, displayName: true, avatarUrl: true, createdAt: true },
    });
    if (!user) throw app.httpErrors.notFound('User not found');
    return user;
  });
}
