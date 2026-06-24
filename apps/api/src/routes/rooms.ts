import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@tiptalk/db';
import { generateFriendlySlug, isValidCustomSlug, sanitizeSlug } from '../lib/slug.js';
import { hashPassword, verifyPassword } from '../lib/passwords.js';
import { cleanupRoom, DEFAULT_ROOM_TTL_HOURS } from '../lib/room-cleanup.js';

const createBody = z.object({
  name: z.string().min(1).max(80),
  slug: z.string().optional(),
  pin: z.string().min(4).max(64).optional(),
  inviteOnly: z.boolean().optional(),
  maxParticipants: z.number().int().positive().max(500).optional(),
  expiresInHours: z.number().int().positive().max(24 * 30).optional(),
  /** Required when posting without auth: the host's display nick. */
  nick: z.string().min(1).max(40).optional(),
  avatarUrl: z.string().url().optional(),
});

const joinBody = z.object({
  pin: z.string().optional(),
  displayName: z.string().min(1).max(40).optional(),
  avatarUrl: z.string().url().optional(),
});

export async function roomRoutes(app: FastifyInstance): Promise<void> {
  app.post('/', async (req, reply) => {
    const body = createBody.parse(req.body);

    // If the client sent an Authorization header but auth failed, surface
    // the expiry/invalid-token as 401 instead of silently falling through
    // to the anonymous path (which would 400 because no nick was sent).
    const sentAuth = !!req.headers.authorization;
    if (sentAuth && !req.sessionUser) {
      throw app.httpErrors.unauthorized('Session expired — please log in again');
    }

    let slug = body.slug ? sanitizeSlug(body.slug) : generateFriendlySlug();
    if (!isValidCustomSlug(slug)) {
      throw app.httpErrors.badRequest('Invalid slug');
    }
    for (let i = 0; i < 5; i += 1) {
      const exists = await prisma.room.findUnique({ where: { slug } });
      if (!exists) break;
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }
    const expiresInHours = body.expiresInHours ?? DEFAULT_ROOM_TTL_HOURS;
    const expiresAt = new Date(Date.now() + expiresInHours * 3600 * 1000);
    const pinHash = body.pin ? await hashPassword(body.pin) : undefined;

    // Authenticated user path — existing behaviour.
    if (req.sessionUser) {
      const userId = req.sessionUser.userId;
      const room = await prisma.room.create({
        data: {
          slug,
          name: body.name,
          creatorId: userId,
          pinHash,
          inviteOnly: body.inviteOnly ?? false,
          maxParticipants: body.maxParticipants,
          expiresAt,
          memberships: { create: { userId, role: 'creator' } },
        },
      });
      reply.code(201);
      return {
        id: room.id,
        slug: room.slug,
        name: room.name,
        asGuest: false,
      };
    }

    // Anonymous host path — needs a nick. We mint a GuestSession that owns
    // the room and a host-scoped JWT the client uses for the room and for
    // managing it (close, etc.). The room and the host session both live for
    // the same TTL.
    if (!body.nick) {
      throw app.httpErrors.badRequest(
        'Either an Authorization token or a nick is required to create a room',
      );
    }
    const guest = await prisma.guestSession.create({
      data: {
        displayName: body.nick,
        avatarUrl: body.avatarUrl,
        fingerprint: `host:${Date.now()}:${Math.random().toString(36).slice(2)}`,
        expiresAt,
      },
    });
    const room = await prisma.room.create({
      data: {
        slug,
        name: body.name,
        creatorGuestId: guest.id,
        pinHash,
        inviteOnly: body.inviteOnly ?? false,
        maxParticipants: body.maxParticipants,
        expiresAt,
        memberships: { create: { guestId: guest.id, role: 'creator' } },
      },
    });
    const guestToken = app.jwt.sign(
      { sub: guest.id, kind: 'guest', roomId: room.id },
      { expiresIn: `${expiresInHours}h` },
    );
    reply.code(201);
    return {
      id: room.id,
      slug: room.slug,
      name: room.name,
      asGuest: true,
      guestId: guest.id,
      guestToken,
      displayName: guest.displayName,
    };
  });

  app.get('/slug-available', async (req) => {
    const slug = sanitizeSlug(String((req.query as { slug?: string }).slug ?? ''));
    if (!isValidCustomSlug(slug)) return { available: false, reason: 'invalid' };
    const existing = await prisma.room.findUnique({ where: { slug } });
    return { available: !existing, slug };
  });

  app.get('/:slug', async (req) => {
    const slug = (req.params as { slug: string }).slug;
    const room = await prisma.room.findUnique({
      where: { slug },
      include: {
        creator: { select: { id: true, displayName: true, avatarUrl: true } },
        creatorGuest: { select: { id: true, displayName: true, avatarUrl: true } },
        memberships: {
          where: { status: 'active' },
          include: {
            user: { select: { id: true, displayName: true, avatarUrl: true } },
            guest: { select: { id: true, displayName: true, avatarUrl: true } },
          },
        },
      },
    });
    if (!room) throw app.httpErrors.notFound('Room not found');
    if (room.closedAt) throw app.httpErrors.gone('Room is closed');
    if (room.expiresAt && room.expiresAt < new Date()) {
      throw app.httpErrors.gone('Room has expired');
    }
    // Surface a unified "creator" identity regardless of whether the host is
    // a real user or an anonymous guest.
    const creatorIdentity = room.creator
      ? { ...room.creator, kind: 'user' as const }
      : room.creatorGuest
        ? { ...room.creatorGuest, kind: 'guest' as const }
        : null;
    return {
      id: room.id,
      slug: room.slug,
      name: room.name,
      creator: creatorIdentity,
      inviteOnly: room.inviteOnly,
      hasPin: !!room.pinHash,
      maxParticipants: room.maxParticipants,
      members: room.memberships.map((m) => ({
        id: m.id,
        role: m.role,
        user: m.user,
        guest: m.guest,
      })),
    };
  });

  app.post('/:slug/join', async (req) => {
    const slug = (req.params as { slug: string }).slug;
    const body = joinBody.parse(req.body ?? {});

    const room = await prisma.room.findUnique({ where: { slug } });
    if (!room) throw app.httpErrors.notFound('Room not found');
    if (room.closedAt) throw app.httpErrors.gone('Room is closed');

    if (room.pinHash) {
      if (!body.pin) throw app.httpErrors.unauthorized('PIN required');
      const ok = await verifyPassword(room.pinHash, body.pin);
      if (!ok) throw app.httpErrors.unauthorized('Invalid PIN');
    }

    if (req.sessionUser) {
      const m = await prisma.roomMembership.upsert({
        where: { roomId_userId: { roomId: room.id, userId: req.sessionUser.userId } },
        create: { roomId: room.id, userId: req.sessionUser.userId, role: 'member' },
        update: { status: 'active' },
      });
      return { membershipId: m.id, asGuest: false };
    }

    // Guest join: ephemeral session + guest-scoped JWT so they can send
    // messages (but not tips / payouts / media uploads).
    const guest = await prisma.guestSession.create({
      data: {
        displayName: body.displayName ?? 'Invitado',
        avatarUrl: body.avatarUrl,
        fingerprint: `${room.id}:${Date.now()}:${Math.random().toString(36).slice(2)}`,
        expiresAt: new Date(Date.now() + 12 * 3600 * 1000),
      },
    });
    const m = await prisma.roomMembership.create({
      data: { roomId: room.id, guestId: guest.id, role: 'member' },
    });
    const guestToken = app.jwt.sign(
      { sub: guest.id, kind: 'guest', roomId: room.id },
      { expiresIn: '12h' },
    );
    return {
      membershipId: m.id,
      asGuest: true,
      guestId: guest.id,
      guestToken,
      displayName: guest.displayName,
    };
  });

  app.post('/:id/close', async (req) => {
    const actor = await app.requireActor(req);
    const id = (req.params as { id: string }).id;
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) throw app.httpErrors.notFound('Room not found');
    const isUserCreator = actor.kind === 'user' && room.creatorId === actor.userId;
    const isGuestCreator =
      actor.kind === 'guest' && room.creatorGuestId === actor.guestId;
    if (!isUserCreator && !isGuestCreator) {
      throw app.httpErrors.forbidden('Only the creator can close this room');
    }
    const result = await cleanupRoom(id);
    return { closed: true, ...result };
  });
}
