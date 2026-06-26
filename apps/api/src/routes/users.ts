import type { FastifyInstance } from 'fastify';
import { prisma } from '@tiptalk/db';

/**
 * Public-profile endpoint. Returns the bare minimum any visitor can see:
 * id, displayName, avatarUrl. Email and wallet stay private.
 */
export async function userRoutes(app: FastifyInstance): Promise<void> {
  app.get('/:id', async (req) => {
    const id = (req.params as { id: string }).id;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, displayName: true, avatarUrl: true, createdAt: true },
    });
    if (!user) throw app.httpErrors.notFound('User not found');
    return user;
  });
}
