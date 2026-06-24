import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@tiptalk/db';
import { hashPassword, verifyPassword } from '../lib/passwords.js';
import { loadEnv } from '@tiptalk/config';

const signupBody = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  displayName: z.string().min(1).max(40),
  locale: z.enum(['es', 'en']).optional(),
});

const upgradeGuestBody = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  displayName: z.string().min(1).max(40).optional(),
});

const claimGuestRoomsBody = z.object({
  guestToken: z.string(),
});

const updateMeBody = z.object({
  displayName: z.string().min(1).max(40).optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

const loginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function authRoutes(app: FastifyInstance): Promise<void> {
  const env = loadEnv();

  app.post('/signup', async (req, reply) => {
    const body = signupBody.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) throw app.httpErrors.conflict('Email already registered');

    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash: await hashPassword(body.password),
        displayName: body.displayName,
        locale: body.locale ?? 'es',
        wallet: { create: {} },
      },
    });
    const token = app.jwt.sign({ sub: user.id, role: user.role }, { expiresIn: env.JWT_ACCESS_TTL });
    reply.code(201);
    return {
      token,
      user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role },
    };
  });

  app.post('/login', async (req) => {
    const body = loginBody.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) throw app.httpErrors.unauthorized('Invalid credentials');
    const ok = await verifyPassword(user.passwordHash, body.password);
    if (!ok) throw app.httpErrors.unauthorized('Invalid credentials');
    const token = app.jwt.sign({ sub: user.id, role: user.role }, { expiresIn: env.JWT_ACCESS_TTL });
    return {
      token,
      user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role },
    };
  });

  app.get('/me', async (req) => {
    const { userId } = await app.requireUser(req);
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        kycStatus: true,
        wallet: { select: { balance: true } },
      },
    });
    return user;
  });

  app.patch('/me', async (req) => {
    const { userId } = await app.requireUser(req);
    const body = updateMeBody.parse(req.body);
    if (body.displayName === undefined && body.avatarUrl === undefined) {
      throw app.httpErrors.badRequest('No fields to update');
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(body.displayName !== undefined ? { displayName: body.displayName } : {}),
        ...(body.avatarUrl !== undefined ? { avatarUrl: body.avatarUrl } : {}),
      },
      select: { id: true, email: true, displayName: true, avatarUrl: true, role: true },
    });
    return user;
  });

  /**
   * Claim an anonymous host's session as a real account.
   *
   * Requires a guest JWT. Creates a User row, then in a single transaction
   * transfers everything that was tied to the GuestSession to the new User:
   *   - rooms.creatorGuestId  → creatorId
   *   - roomMemberships.guestId → userId  (skips conflicts with existing memberships)
   *   - messages.guestId        → authorId
   *   - wallet.guestId          → userId
   *
   * Returns a fresh user JWT so the client can swap its session.
   */
  app.post('/upgrade-guest', async (req, reply) => {
    const actor = await app.requireActor(req);
    if (actor.kind !== 'guest') {
      throw app.httpErrors.badRequest('Only a guest session can be upgraded');
    }
    const body = upgradeGuestBody.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) throw app.httpErrors.conflict('Email already registered');

    const guest = await prisma.guestSession.findUnique({ where: { id: actor.guestId } });
    if (!guest) throw app.httpErrors.notFound('Guest session not found');

    const displayName = body.displayName ?? guest.displayName;
    const passwordHash = await hashPassword(body.password);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: body.email,
          passwordHash,
          displayName,
          emailVerified: false,
          locale: 'es',
        },
      });

      // Rooms — transfer ownership
      await tx.room.updateMany({
        where: { creatorGuestId: actor.guestId },
        data: { creatorId: newUser.id, creatorGuestId: null },
      });

      // Memberships — best-effort transfer. If the user happens to already
      // be a member of the same room (unlikely for a freshly-created user)
      // we just delete the guest membership instead of upserting.
      const memberships = await tx.roomMembership.findMany({
        where: { guestId: actor.guestId },
      });
      for (const m of memberships) {
        const conflict = await tx.roomMembership.findUnique({
          where: { roomId_userId: { roomId: m.roomId, userId: newUser.id } },
        });
        if (conflict) {
          await tx.roomMembership.delete({ where: { id: m.id } });
        } else {
          await tx.roomMembership.update({
            where: { id: m.id },
            data: { userId: newUser.id, guestId: null },
          });
        }
      }

      // Messages
      await tx.message.updateMany({
        where: { guestId: actor.guestId },
        data: { authorId: newUser.id, guestId: null },
      });

      // Wallet — move balance + ledger over, or create one if guest had none.
      const guestWallet = await tx.wallet.findUnique({ where: { guestId: actor.guestId } });
      if (guestWallet) {
        await tx.wallet.update({
          where: { id: guestWallet.id },
          data: { userId: newUser.id, guestId: null },
        });
      } else {
        await tx.wallet.create({ data: { userId: newUser.id } });
      }

      return newUser;
    });

    const newToken = app.jwt.sign(
      { sub: user.id, role: user.role },
      { expiresIn: env.JWT_ACCESS_TTL },
    );
    reply.code(201);
    return {
      token: newToken,
      user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role },
      upgraded: true,
    };
  });

  /**
   * Same ownership-transfer logic as /upgrade-guest, but for hosts who
   * already have an account. After /auth/login, the client posts here with
   * the guest token still in localStorage. We verify the guest token, grab
   * its guestId, and migrate that guest session's rooms + memberships +
   * messages + wallet to the logged-in user.
   */
  app.post('/claim-guest-rooms', async (req) => {
    const { userId } = await app.requireUser(req);
    const body = claimGuestRoomsBody.parse(req.body);

    let guestId: string;
    try {
      const decoded = app.jwt.verify<{ sub: string; kind?: string }>(body.guestToken);
      if (decoded.kind !== 'guest') throw new Error('Not a guest token');
      guestId = decoded.sub;
    } catch {
      throw app.httpErrors.badRequest('Invalid guest token');
    }

    const moved = await prisma.$transaction(async (tx) => {
      const rooms = await tx.room.updateMany({
        where: { creatorGuestId: guestId },
        data: { creatorId: userId, creatorGuestId: null },
      });

      const memberships = await tx.roomMembership.findMany({ where: { guestId } });
      for (const m of memberships) {
        const conflict = await tx.roomMembership.findUnique({
          where: { roomId_userId: { roomId: m.roomId, userId } },
        });
        if (conflict) {
          await tx.roomMembership.delete({ where: { id: m.id } });
        } else {
          await tx.roomMembership.update({
            where: { id: m.id },
            data: { userId, guestId: null },
          });
        }
      }

      const messages = await tx.message.updateMany({
        where: { guestId },
        data: { authorId: userId, guestId: null },
      });

      // Wallet: prefer the user's existing wallet. If only the guest had one,
      // move it over. If both exist, drop the guest one (could sum later).
      const guestWallet = await tx.wallet.findUnique({ where: { guestId } });
      if (guestWallet) {
        const userWallet = await tx.wallet.findUnique({ where: { userId } });
        if (userWallet) {
          await tx.wallet.delete({ where: { id: guestWallet.id } });
        } else {
          await tx.wallet.update({
            where: { id: guestWallet.id },
            data: { userId, guestId: null },
          });
        }
      }

      return { rooms: rooms.count, messages: messages.count };
    });

    return { migrated: true, ...moved };
  });
}
