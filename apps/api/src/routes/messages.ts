import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@tiptalk/db';
import { formatMediaForClient } from '../lib/media-urls.js';

const createBody = z.object({
  roomId: z.string(),
  kind: z.enum(['text', 'image', 'video']),
  body: z.string().max(4000).optional(),
  mediaId: z.string().optional(),
});

const listQuery = z.object({
  roomId: z.string(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

export async function messageRoutes(app: FastifyInstance): Promise<void> {
  app.post('/', async (req, reply) => {
    const actor = await app.requireActor(req);
    const body = createBody.parse(req.body);

    if (actor.kind === 'guest') {
      // Guest tokens are room-scoped at issuance; only allow into the same room.
      if (actor.roomId !== body.roomId) {
        throw app.httpErrors.forbidden('Guest token does not match room');
      }
      const membership = await prisma.roomMembership.findUnique({
        where: { roomId_guestId: { roomId: body.roomId, guestId: actor.guestId } },
      });
      if (!membership || membership.status !== 'active') {
        throw app.httpErrors.forbidden('Not a member of this room');
      }
      if (membership.mutedUntil && membership.mutedUntil > new Date()) {
        throw app.httpErrors.forbidden('You are muted in this room');
      }
      const msg = await prisma.message.create({
        data: {
          roomId: body.roomId,
          guestId: actor.guestId,
          kind: body.kind,
          body: body.body,
          mediaId: body.mediaId,
        },
        include: {
          guest: { select: { id: true, displayName: true, avatarUrl: true } },
          media: true,
        },
      });
      reply.code(201);
      return { ...msg, media: msg.media ? formatMediaForClient(msg.media) : null };
    }

    // user path
    const userId = actor.userId;
    const membership = await prisma.roomMembership.findUnique({
      where: { roomId_userId: { roomId: body.roomId, userId } },
    });
    if (!membership || membership.status !== 'active') {
      throw app.httpErrors.forbidden('Not a member of this room');
    }
    if (membership.mutedUntil && membership.mutedUntil > new Date()) {
      throw app.httpErrors.forbidden('You are muted in this room');
    }

    const msg = await prisma.message.create({
      data: {
        roomId: body.roomId,
        authorId: userId,
        kind: body.kind,
        body: body.body,
        mediaId: body.mediaId,
      },
      include: {
        author: { select: { id: true, displayName: true, avatarUrl: true } },
        media: true,
      },
    });
    reply.code(201);
    return { ...msg, media: msg.media ? formatMediaForClient(msg.media) : null };
  });

  app.get('/', async (req) => {
    const q = listQuery.parse(req.query);
    const messages = await prisma.message.findMany({
      where: { roomId: q.roomId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: q.limit + 1,
      ...(q.cursor ? { cursor: { id: q.cursor }, skip: 1 } : {}),
      include: {
        author: { select: { id: true, displayName: true, avatarUrl: true } },
        guest: { select: { id: true, displayName: true, avatarUrl: true } },
        media: true,
      },
    });
    let nextCursor: string | null = null;
    if (messages.length > q.limit) {
      const last = messages.pop()!;
      nextCursor = last.id;
    }
    return {
      messages: messages
        .reverse()
        .map((m) => ({ ...m, media: m.media ? formatMediaForClient(m.media) : null })),
      nextCursor,
    };
  });
}
