import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma, Prisma } from '@tiptalk/db';
import { appendLedgerEntry } from '../lib/wallet.js';
import { fetchPresence } from '../lib/realtime.js';
import { cleanupRoom } from '../lib/room-cleanup.js';

/**
 * Admin panel endpoints. Every handler starts with `app.requireAdmin(req)`;
 * the role check itself lives in plugins/auth.ts (JWT role claim).
 *
 * Presence (who is online / live counts per room) is fetched ONCE per request
 * from the realtime server and reused — never inside a loop.
 */

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const PENDING_PAYOUT_STATUSES = ['requested', 'in_review'] as const;
const USER_ROLES = ['user', 'mod', 'admin'] as const;

// ---------------------------------------------------------------------------
// Query / body schemas
// ---------------------------------------------------------------------------

const pageParam = z.coerce.number().int().min(1).default(1);
const limitParam = z.coerce
  .number()
  .int()
  .default(25)
  .transform((n) => Math.min(100, Math.max(1, n)));
const searchParam = z
  .string()
  .trim()
  .max(200)
  .optional()
  .transform((s) => (s ? s : undefined));

const usersQuery = z.object({
  q: searchParam,
  page: pageParam,
  limit: limitParam,
});

const roomsQuery = z.object({
  status: z.enum(['open', 'closed', 'all']).default('open'),
  q: searchParam,
  page: pageParam,
  limit: limitParam,
});

const payoutsQuery = z.object({
  status: z.enum(['requested', 'in_review', 'paid', 'failed', 'refunded', 'all']).default('requested'),
});

const contactsQuery = z.object({
  status: z.enum(['new', 'read', 'archived', 'all']).default('new'),
});

const roleBody = z.object({
  role: z.enum(USER_ROLES),
});

const approvePayoutBody = z.object({
  stripeTransferId: z.string().trim().min(1).max(200).optional(),
});

const rejectPayoutBody = z.object({
  reason: z.string().trim().min(1).max(500),
});

const contactStatusBody = z.object({
  status: z.enum(['new', 'read', 'archived']),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isRecordNotFound(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025';
}

function isPendingPayout(status: string): boolean {
  return (PENDING_PAYOUT_STATUSES as readonly string[]).includes(status);
}

type RoomCreatorRow = {
  creator: { id: string; displayName: string; avatarUrl: string | null } | null;
  creatorGuest: { id: string; displayName: string; avatarUrl: string | null } | null;
};

function mapRoomCreator(room: RoomCreatorRow):
  | { kind: 'user' | 'guest'; id: string; displayName: string; avatarUrl: string | null }
  | null {
  if (room.creator) return { kind: 'user', ...room.creator };
  if (room.creatorGuest) return { kind: 'guest', ...room.creatorGuest };
  return null;
}

const payoutRowSelect = {
  id: true,
  userId: true,
  tipsys: true,
  grossEurCents: true,
  feeEurCents: true,
  netEurCents: true,
  status: true,
  createdAt: true,
  paidAt: true,
  failureReason: true,
  stripeTransferId: true,
  user: {
    select: {
      email: true,
      displayName: true,
      avatarUrl: true,
      connect: { select: { stripeAccountId: true, payoutsEnabled: true } },
    },
  },
} satisfies Prisma.PayoutRequestSelect;

type PayoutRow = Prisma.PayoutRequestGetPayload<{ select: typeof payoutRowSelect }>;

function mapPayoutRow(p: PayoutRow) {
  const { user, ...rest } = p;
  return {
    ...rest,
    user: { email: user.email, displayName: user.displayName, avatarUrl: user.avatarUrl },
    connect: user.connect
      ? { stripeAccountId: user.connect.stripeAccountId, payoutsEnabled: user.connect.payoutsEnabled }
      : null,
  };
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

export async function adminRoutes(app: FastifyInstance): Promise<void> {
  // -------------------------------------------------------------------------
  // Dashboard
  // -------------------------------------------------------------------------

  app.get('/stats', async (req) => {
    await app.requireAdmin(req);
    const since = new Date(Date.now() - SEVEN_DAYS_MS);

    const [
      presence,
      usersTotal,
      usersLast7d,
      usersBlocked,
      roomsOpen,
      roomsCreatedLast7d,
      tips7d,
      tipsTotal,
      payoutsPending,
      contactsNew,
    ] = await Promise.all([
      fetchPresence(),
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: since } } }),
      prisma.user.count({ where: { blockedAt: { not: null } } }),
      prisma.room.count({ where: { closedAt: null } }),
      prisma.room.count({ where: { createdAt: { gte: since } } }),
      prisma.tip.aggregate({
        where: { createdAt: { gte: since } },
        _count: { _all: true },
        _sum: { amount: true },
      }),
      prisma.tip.aggregate({ _count: { _all: true }, _sum: { amount: true } }),
      prisma.payoutRequest.aggregate({
        where: { status: { in: [...PENDING_PAYOUT_STATUSES] } },
        _count: { _all: true },
        _sum: { netEurCents: true },
      }),
      prisma.contactMessage.count({ where: { status: 'new' } }),
    ]);

    return {
      users: { total: usersTotal, last7d: usersLast7d, blocked: usersBlocked },
      rooms: { open: roomsOpen, createdLast7d: roomsCreatedLast7d },
      tips: {
        count7d: tips7d._count._all,
        tipsys7d: tips7d._sum.amount ?? 0,
        countTotal: tipsTotal._count._all,
        tipsysTotal: tipsTotal._sum.amount ?? 0,
      },
      payouts: {
        pending: payoutsPending._count._all,
        pendingNetEurCents: payoutsPending._sum.netEurCents ?? 0,
      },
      contacts: { new: contactsNew },
      online: { users: presence.onlineUserIds.length, sockets: presence.totalSockets },
    };
  });

  // -------------------------------------------------------------------------
  // Users
  // -------------------------------------------------------------------------

  app.get('/users', async (req) => {
    await app.requireAdmin(req);
    const { q, page, limit } = usersQuery.parse(req.query);

    const where: Prisma.UserWhereInput = q
      ? {
          OR: [
            { email: { contains: q, mode: 'insensitive' } },
            { displayName: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {};

    const [presence, users, total] = await Promise.all([
      fetchPresence(),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          displayName: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
          blockedAt: true,
          wallet: { select: { balance: true } },
          _count: { select: { rooms: { where: { closedAt: null } } } },
        },
      }),
      prisma.user.count({ where }),
    ]);
    const online = new Set(presence.onlineUserIds);

    return {
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        avatarUrl: u.avatarUrl,
        role: u.role,
        createdAt: u.createdAt,
        blockedAt: u.blockedAt,
        walletBalance: u.wallet?.balance ?? 0,
        openRooms: u._count.rooms,
        online: online.has(u.id),
      })),
      total,
      page,
      limit,
    };
  });

  app.get('/users/:id', async (req) => {
    await app.requireAdmin(req);
    const id = (req.params as { id: string }).id;

    const roomSelect = {
      id: true,
      slug: true,
      name: true,
      createdAt: true,
      closedAt: true,
      _count: { select: { memberships: true, messages: true } },
    } satisfies Prisma.RoomSelect;

    // Every relation is fetched as its own top-level query so they all run in
    // ONE parallel round-trip. Nesting them under user.findUnique looks like
    // one query but Prisma loads each relation sequentially (user → wallet →
    // connect → photos → payouts), which is ~5 round-trips to Supabase.
    const [presence, user, wallet, connect, profilePhotos, payouts, rooms, tipsReceived, tipsSent, recentLedger] =
      await Promise.all([
        fetchPresence(),
        prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            email: true,
            displayName: true,
            avatarUrl: true,
            role: true,
            kycStatus: true,
            emailVerified: true,
            blockedAt: true,
            createdAt: true,
          },
        }),
        prisma.wallet.findUnique({ where: { userId: id }, select: { id: true, balance: true } }),
        prisma.connectAccount.findUnique({
          where: { userId: id },
          select: { stripeAccountId: true, status: true, payoutsEnabled: true },
        }),
        prisma.profilePhoto.findMany({
          where: { userId: id },
          orderBy: { createdAt: 'desc' },
          select: { id: true, publicUrl: true, isPublic: true, createdAt: true },
        }),
        prisma.payoutRequest.findMany({
          where: { userId: id },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            tipsys: true,
            netEurCents: true,
            status: true,
            createdAt: true,
            paidAt: true,
          },
        }),
        // One query for all the user's rooms; partitioned open-first below.
        prisma.room.findMany({
          where: { creatorId: id },
          orderBy: { createdAt: 'desc' },
          take: 100,
          select: roomSelect,
        }),
        prisma.tip.aggregate({
          where: { receiverId: id },
          _count: { _all: true },
          _sum: { amount: true },
        }),
        prisma.tip.aggregate({
          where: { senderId: id },
          _count: { _all: true },
          _sum: { amount: true },
        }),
        prisma.ledgerEntry.findMany({
          where: { wallet: { userId: id } },
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: { id: true, kind: true, amount: true, balanceAfter: true, createdAt: true },
        }),
      ]);
    if (!user) throw app.httpErrors.notFound('User not found');

    // Open first, then closed — each group keeps createdAt desc, 50 overall.
    const openRooms = rooms.filter((r) => r.closedAt === null);
    const closedRooms = rooms.filter((r) => r.closedAt !== null);

    return {
      user,
      online: presence.onlineUserIds.includes(id),
      wallet: { balance: wallet?.balance ?? 0 },
      connect: connect
        ? {
            stripeAccountId: connect.stripeAccountId,
            status: connect.status,
            payoutsEnabled: connect.payoutsEnabled,
          }
        : null,
      rooms: [...openRooms, ...closedRooms].slice(0, 50).map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        createdAt: r.createdAt,
        closedAt: r.closedAt,
        membersCount: r._count.memberships,
        messagesCount: r._count.messages,
        liveCount: presence.roomCounts[r.id] ?? 0,
      })),
      photos: profilePhotos.map((p) => ({
        id: p.id,
        url: p.publicUrl,
        isPublic: p.isPublic,
        createdAt: p.createdAt,
      })),
      payouts,
      tips: {
        received: { count: tipsReceived._count._all, tipsys: tipsReceived._sum.amount ?? 0 },
        sent: { count: tipsSent._count._all, tipsys: tipsSent._sum.amount ?? 0 },
      },
      recentLedger,
    };
  });

  app.post('/users/:id/block', async (req) => {
    const me = await app.requireAdmin(req);
    const id = (req.params as { id: string }).id;
    if (id === me.userId) throw app.httpErrors.badRequest('You cannot block yourself');

    const target = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, blockedAt: true },
    });
    if (!target) throw app.httpErrors.notFound('User not found');
    if (target.role === 'admin') throw app.httpErrors.badRequest('You cannot block another admin');

    // Idempotent: keep the original timestamp if already blocked.
    if (target.blockedAt) return { blockedAt: target.blockedAt };

    const updated = await prisma.user.update({
      where: { id },
      data: { blockedAt: new Date() },
      select: { blockedAt: true },
    });
    return { blockedAt: updated.blockedAt };
  });

  app.post('/users/:id/unblock', async (req) => {
    await app.requireAdmin(req);
    const id = (req.params as { id: string }).id;
    try {
      const updated = await prisma.user.update({
        where: { id },
        data: { blockedAt: null },
        select: { blockedAt: true },
      });
      return { blockedAt: updated.blockedAt };
    } catch (err) {
      if (isRecordNotFound(err)) throw app.httpErrors.notFound('User not found');
      throw err;
    }
  });

  app.post('/users/:id/role', async (req) => {
    const me = await app.requireAdmin(req);
    const id = (req.params as { id: string }).id;
    const body = roleBody.parse(req.body);
    if (id === me.userId) throw app.httpErrors.badRequest('You cannot change your own role');

    try {
      const updated = await prisma.user.update({
        where: { id },
        data: { role: body.role },
        select: { role: true },
      });
      return { role: updated.role };
    } catch (err) {
      if (isRecordNotFound(err)) throw app.httpErrors.notFound('User not found');
      throw err;
    }
  });

  // -------------------------------------------------------------------------
  // Rooms
  // -------------------------------------------------------------------------

  app.get('/rooms', async (req) => {
    await app.requireAdmin(req);
    const { status, q, page, limit } = roomsQuery.parse(req.query);

    const where: Prisma.RoomWhereInput = {};
    if (status === 'open') where.closedAt = null;
    else if (status === 'closed') where.closedAt = { not: null };
    if (q) {
      where.OR = [
        { slug: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [presence, rooms, total] = await Promise.all([
      fetchPresence(),
      prisma.room.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          slug: true,
          name: true,
          createdAt: true,
          closedAt: true,
          creator: { select: { id: true, displayName: true, avatarUrl: true } },
          creatorGuest: { select: { id: true, displayName: true, avatarUrl: true } },
          _count: { select: { memberships: true, messages: true } },
        },
      }),
      prisma.room.count({ where }),
    ]);

    return {
      rooms: rooms.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        createdAt: r.createdAt,
        closedAt: r.closedAt,
        creator: mapRoomCreator(r),
        membersCount: r._count.memberships,
        messagesCount: r._count.messages,
        liveCount: presence.roomCounts[r.id] ?? 0,
      })),
      total,
      page,
      limit,
    };
  });

  app.post('/rooms/:id/close', async (req) => {
    await app.requireAdmin(req);
    const id = (req.params as { id: string }).id;
    const room = await prisma.room.findUnique({ where: { id }, select: { id: true, closedAt: true } });
    if (!room) throw app.httpErrors.notFound('Room not found');
    if (!room.closedAt) await cleanupRoom(id);
    return { closed: true };
  });

  // -------------------------------------------------------------------------
  // Payouts
  // -------------------------------------------------------------------------

  app.get('/payouts', async (req) => {
    await app.requireAdmin(req);
    const { status } = payoutsQuery.parse(req.query);
    const where: Prisma.PayoutRequestWhereInput = status === 'all' ? {} : { status };
    const payouts = await prisma.payoutRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: payoutRowSelect,
    });
    return { payouts: payouts.map(mapPayoutRow) };
  });

  app.post('/payouts/:id/approve', async (req) => {
    await app.requireAdmin(req);
    const id = (req.params as { id: string }).id;
    const body = approvePayoutBody.parse(req.body);

    const existing = await prisma.payoutRequest.findUnique({
      where: { id },
      select: { status: true, stripeTransferId: true },
    });
    if (!existing) throw app.httpErrors.notFound('Payout not found');
    if (!isPendingPayout(existing.status)) {
      throw app.httpErrors.conflict(`Payout is already ${existing.status}`);
    }

    try {
      // The status filter in `where` makes this atomic against a concurrent
      // approve/reject: whoever loses the race hits P2025 → 409.
      const updated = await prisma.payoutRequest.update({
        where: { id, status: { in: [...PENDING_PAYOUT_STATUSES] } },
        data: {
          status: 'paid',
          paidAt: new Date(),
          stripeTransferId: body.stripeTransferId ?? existing.stripeTransferId,
        },
        select: payoutRowSelect,
      });
      return mapPayoutRow(updated);
    } catch (err) {
      if (isRecordNotFound(err)) throw app.httpErrors.conflict('Payout is no longer pending');
      throw err;
    }
  });

  app.post('/payouts/:id/reject', async (req) => {
    await app.requireAdmin(req);
    const id = (req.params as { id: string }).id;
    const body = rejectPayoutBody.parse(req.body);

    const existing = await prisma.payoutRequest.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!existing) throw app.httpErrors.notFound('Payout not found');
    if (!isPendingPayout(existing.status)) {
      throw app.httpErrors.conflict(`Payout is already ${existing.status}`);
    }

    const updated = await prisma.$transaction(async (tx) => {
      let refunded: PayoutRow;
      try {
        refunded = await tx.payoutRequest.update({
          where: { id, status: { in: [...PENDING_PAYOUT_STATUSES] } },
          data: { status: 'refunded', failureReason: body.reason },
          select: payoutRowSelect,
        });
      } catch (err) {
        if (isRecordNotFound(err)) throw app.httpErrors.conflict('Payout is no longer pending');
        throw err;
      }

      // Credit the held Tipsys back to the user's wallet, in the same tx.
      const wallet =
        (await tx.wallet.findUnique({ where: { userId: refunded.userId } })) ??
        (await tx.wallet.create({ data: { userId: refunded.userId } }));

      await appendLedgerEntry({
        walletId: wallet.id,
        kind: 'PAYOUT_REFUND',
        amount: refunded.tipsys,
        idempotencyKey: `payout:${id}:refund`,
        refType: 'payout',
        refId: id,
        tx,
      });

      return refunded;
    });

    return mapPayoutRow(updated);
  });

  // -------------------------------------------------------------------------
  // Contact messages
  // -------------------------------------------------------------------------

  app.get('/contacts', async (req) => {
    await app.requireAdmin(req);
    const { status } = contactsQuery.parse(req.query);
    const where: Prisma.ContactMessageWhereInput = status === 'all' ? {} : { status };
    const contacts = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        message: true,
        status: true,
        createdAt: true,
      },
    });
    return { contacts };
  });

  app.post('/contacts/:id/status', async (req) => {
    await app.requireAdmin(req);
    const id = (req.params as { id: string }).id;
    const body = contactStatusBody.parse(req.body);
    try {
      return await prisma.contactMessage.update({
        where: { id },
        data: { status: body.status },
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          message: true,
          status: true,
          createdAt: true,
        },
      });
    } catch (err) {
      if (isRecordNotFound(err)) throw app.httpErrors.notFound('Contact message not found');
      throw err;
    }
  });
}
