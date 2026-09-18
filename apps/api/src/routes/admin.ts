import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma, Prisma } from '@tiptalk/db';
import { appendLedgerEntry } from '../lib/wallet.js';
import { fetchPresence } from '../lib/realtime.js';
import { cleanupRoom } from '../lib/room-cleanup.js';
import { formatMediaForClient } from '../lib/media-urls.js';
import { getStorage } from '../lib/storage.js';
import { deleteMuxAssetByUploadId } from '../lib/video.js';
import { loadEnv } from '@tiptalk/config';

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

const mediaQuery = z.object({
  source: z.enum(['all', 'chat', 'avatar', 'gallery']).default('all'),
  kind: z.enum(['all', 'image', 'video']).default('all'),
  page: pageParam,
  limit: z.coerce
    .number()
    .int()
    .default(48)
    .transform((n) => Math.min(120, Math.max(1, n))),
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

/** One row of the unified media feed (chat upload / avatar / gallery photo). */
interface AdminMediaItem {
  id: string;
  source: 'chat' | 'avatar' | 'gallery';
  kind: 'image' | 'video';
  status: string;
  url: string | null;
  thumbnailUrl: string | null;
  mimeType: string | null;
  bytes: number | null;
  createdAt: Date;
  isPublic: boolean | null;
  owner: {
    id: string | null;
    displayName: string;
    avatarUrl: string | null;
    isGuest: boolean;
  } | null;
  room: { id: string; slug: string; name: string } | null;
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

/**
 * Derive the storage key from a Supabase public URL, e.g.
 *   https://x.supabase.co/storage/v1/object/public/profiles/avatars/a.webp
 *   -> avatars/a.webp   (bucket segment dropped; deleteObject re-routes it)
 */
function storageKeyFromPublicUrl(url: string): string | null {
  const marker = '/object/public/';
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const rest = url.slice(idx + marker.length);
  const slash = rest.indexOf('/');
  if (slash === -1) return null;
  return rest.slice(slash + 1);
}

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

  /**
   * Room detail for the admin viewer: meta + creator + members (from DB
   * memberships, flagged online via presence) + live socket count. Does NOT
   * create a membership or touch presence — the admin is an observer.
   */
  app.get('/rooms/:id', async (req) => {
    await app.requireAdmin(req);
    const id = (req.params as { id: string }).id;

    const [presence, room, memberships] = await Promise.all([
      fetchPresence(),
      prisma.room.findUnique({
        where: { id },
        select: {
          id: true,
          slug: true,
          name: true,
          createdAt: true,
          closedAt: true,
          expiresAt: true,
          creator: { select: { id: true, displayName: true, avatarUrl: true } },
          creatorGuest: { select: { id: true, displayName: true, avatarUrl: true } },
          _count: { select: { memberships: true, messages: true } },
        },
      }),
      prisma.roomMembership.findMany({
        where: { roomId: id },
        orderBy: { joinedAt: 'asc' },
        select: {
          id: true,
          role: true,
          status: true,
          joinedAt: true,
          user: { select: { id: true, displayName: true, avatarUrl: true } },
          guest: { select: { id: true, displayName: true, avatarUrl: true } },
        },
      }),
    ]);
    if (!room) throw app.httpErrors.notFound('Room not found');
    const online = new Set(presence.onlineUserIds);

    return {
      room: {
        id: room.id,
        slug: room.slug,
        name: room.name,
        createdAt: room.createdAt,
        closedAt: room.closedAt,
        expiresAt: room.expiresAt,
        creator: mapRoomCreator(room),
        membersCount: room._count.memberships,
        messagesCount: room._count.messages,
        liveCount: presence.roomCounts[room.id] ?? 0,
      },
      members: memberships.map((m) => {
        const who = m.user ?? m.guest;
        return {
          id: m.id,
          role: m.role,
          status: m.status,
          joinedAt: m.joinedAt,
          kind: m.user ? ('user' as const) : ('guest' as const),
          userId: m.user?.id ?? null,
          displayName: who?.displayName ?? 'Desconocido',
          avatarUrl: who?.avatarUrl ?? null,
          // Only registered users have a stable socket identity we can match.
          online: m.user ? online.has(m.user.id) : false,
        };
      }),
    };
  });

  /**
   * Message history for the admin viewer. Same shape the chat client uses
   * (author/guest/media) so the web can reuse ChatMessageItem. Cursor-paged,
   * newest-first from the DB, returned oldest-first for rendering.
   */
  app.get('/rooms/:id/messages', async (req) => {
    await app.requireAdmin(req);
    const id = (req.params as { id: string }).id;
    const { cursor, limit } = z
      .object({
        cursor: z.string().optional(),
        limit: z.coerce.number().int().positive().max(200).default(100),
      })
      .parse(req.query);

    const exists = await prisma.room.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw app.httpErrors.notFound('Room not found');

    const rows = await prisma.message.findMany({
      where: { roomId: id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        author: { select: { id: true, displayName: true, avatarUrl: true } },
        guest: { select: { id: true, displayName: true, avatarUrl: true } },
        media: true,
      },
    });
    let nextCursor: string | null = null;
    if (rows.length > limit) {
      const last = rows.pop();
      nextCursor = last?.id ?? null;
    }
    return {
      messages: rows
        .reverse()
        .map((m) => ({ ...m, media: m.media ? formatMediaForClient(m.media) : null })),
      nextCursor,
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
  // Media (chat uploads + profile avatars + gallery photos)
  // -------------------------------------------------------------------------

  /**
   * Unified media feed across the three places images live:
   *   - chat    → MediaAsset rows (images AND videos) attached to messages
   *   - avatar  → User.avatarUrl (already a public URL, profiles bucket)
   *   - gallery → ProfilePhoto rows (already public URLs, profiles bucket)
   *
   * Pagination merges the sources: we take `page * limit` newest rows from
   * each active source, merge, sort by date and slice. That's exact — any
   * item in the global top N is necessarily in the top N of its own source —
   * at the cost of reading up to 3x the page. Fine at this scale.
   */
  app.get('/media', async (req) => {
    await app.requireAdmin(req);
    const { source, kind, page, limit } = mediaQuery.parse(req.query);

    const wantChat = source === 'all' || source === 'chat';
    // Avatars and gallery photos are always images, so a video-only filter
    // excludes them entirely.
    const videosOnly = kind === 'video';
    const wantAvatar = (source === 'all' || source === 'avatar') && !videosOnly;
    const wantGallery = (source === 'all' || source === 'gallery') && !videosOnly;

    const window = page * limit;
    const chatWhere: Prisma.MediaAssetWhereInput = kind === 'all' ? {} : { kind };

    const [
      chatRows,
      avatarRows,
      galleryRows,
      chatCount,
      avatarCount,
      galleryCount,
      chatBytes,
    ] = await Promise.all([
      wantChat
        ? prisma.mediaAsset.findMany({
            where: chatWhere,
            orderBy: { createdAt: 'desc' },
            take: window,
            include: {
              messages: {
                take: 1,
                orderBy: { createdAt: 'asc' },
                select: {
                  room: { select: { id: true, slug: true, name: true } },
                  author: { select: { id: true, displayName: true, avatarUrl: true } },
                  guest: { select: { id: true, displayName: true, avatarUrl: true } },
                },
              },
            },
          })
        : Promise.resolve([]),
      wantAvatar
        ? prisma.user.findMany({
            where: { avatarUrl: { not: null } },
            orderBy: { updatedAt: 'desc' },
            take: window,
            select: { id: true, displayName: true, avatarUrl: true, updatedAt: true },
          })
        : Promise.resolve([]),
      wantGallery
        ? prisma.profilePhoto.findMany({
            orderBy: { createdAt: 'desc' },
            take: window,
            select: {
              id: true,
              publicUrl: true,
              isPublic: true,
              createdAt: true,
              user: { select: { id: true, displayName: true, avatarUrl: true } },
            },
          })
        : Promise.resolve([]),
      prisma.mediaAsset.count({ where: chatWhere }),
      prisma.user.count({ where: { avatarUrl: { not: null } } }),
      prisma.profilePhoto.count(),
      prisma.mediaAsset.aggregate({ where: chatWhere, _sum: { bytes: true } }),
    ]);

    const items: AdminMediaItem[] = [];

    for (const m of chatRows) {
      const formatted = formatMediaForClient(m);
      const msg = m.messages[0];
      const who = msg?.author ?? msg?.guest ?? null;
      items.push({
        id: `chat:${m.id}`,
        source: 'chat',
        kind: m.kind === 'video' ? 'video' : 'image',
        status: m.status,
        url: formatted.publicUrl ?? formatted.hlsUrl,
        thumbnailUrl: formatted.thumbnailUrl ?? formatted.publicUrl,
        mimeType: m.mimeType,
        bytes: m.bytes,
        createdAt: m.createdAt,
        isPublic: null,
        // Guests have no admin profile page, so only users carry an id.
        owner: who
          ? {
              id: msg?.author ? who.id : null,
              displayName: who.displayName,
              avatarUrl: who.avatarUrl,
              isGuest: !msg?.author,
            }
          : null,
        room: msg?.room ?? null,
      });
    }

    for (const u of avatarRows) {
      if (!u.avatarUrl) continue;
      items.push({
        id: `avatar:${u.id}`,
        source: 'avatar',
        kind: 'image',
        status: 'ready',
        url: u.avatarUrl,
        thumbnailUrl: u.avatarUrl,
        mimeType: null,
        bytes: null,
        // No timestamp is stored for the avatar itself; updatedAt is the
        // closest proxy for "when this user last changed their profile".
        createdAt: u.updatedAt,
        isPublic: null,
        owner: { id: u.id, displayName: u.displayName, avatarUrl: u.avatarUrl, isGuest: false },
        room: null,
      });
    }

    for (const p of galleryRows) {
      items.push({
        id: `gallery:${p.id}`,
        source: 'gallery',
        kind: 'image',
        status: 'ready',
        url: p.publicUrl,
        thumbnailUrl: p.publicUrl,
        mimeType: null,
        bytes: null,
        createdAt: p.createdAt,
        isPublic: p.isPublic,
        owner: {
          id: p.user.id,
          displayName: p.user.displayName,
          avatarUrl: p.user.avatarUrl,
          isGuest: false,
        },
        room: null,
      });
    }

    items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total =
      (wantChat ? chatCount : 0) +
      (wantAvatar ? avatarCount : 0) +
      (wantGallery ? galleryCount : 0);

    return {
      items: items.slice((page - 1) * limit, page * limit),
      total,
      page,
      limit,
      counts: {
        chat: chatCount,
        avatar: videosOnly ? 0 : avatarCount,
        gallery: videosOnly ? 0 : galleryCount,
        total: chatCount + (videosOnly ? 0 : avatarCount + galleryCount),
      },
      // Only chat uploads record their size; avatars/gallery are plain URLs.
      chatBytes: chatBytes._sum.bytes ?? 0,
    };
  });

  /**
   * Delete a single media item from the admin Media view. Handles all three
   * sources; removes the file from storage AND the DB reference.
   *   - chat:<mediaAssetId>  -> delete files + MediaAsset row (messages keep
   *                            their row but lose the image via SetNull)
   *   - avatar:<userId>      -> clear avatarUrl + best-effort delete the file
   *   - gallery:<photoId>    -> delete file (by storageKey) + ProfilePhoto row
   */
  app.delete('/media/:source/:id', async (req, reply) => {
    await app.requireAdmin(req);
    const { source, id } = req.params as { source: string; id: string };
    const storage = getStorage();

    if (source === 'chat') {
      const asset = await prisma.mediaAsset.findUnique({ where: { id } });
      if (!asset) throw app.httpErrors.notFound('Media no encontrada');
      const env = loadEnv();
      if (asset.kind === 'video' && asset.hlsManifestKey?.startsWith('mux:')) {
        if (env.VIDEO_PROVIDER === 'mux' && asset.originalKey) {
          await deleteMuxAssetByUploadId(asset.originalKey).catch(() => undefined);
        }
      } else {
        if (asset.originalKey) await storage.deleteObject(asset.originalKey).catch(() => undefined);
        if (asset.thumbnailKey && asset.thumbnailKey !== asset.originalKey) {
          await storage.deleteObject(asset.thumbnailKey).catch(() => undefined);
        }
        if (asset.hlsManifestKey && !asset.hlsManifestKey.startsWith('mux:')) {
          await storage.deleteObject(asset.hlsManifestKey).catch(() => undefined);
        }
      }
      await prisma.mediaAsset.delete({ where: { id } });
      reply.code(204);
      return null;
    }

    if (source === 'avatar') {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, avatarUrl: true },
      });
      if (!user || !user.avatarUrl) throw app.httpErrors.notFound('Avatar no encontrado');
      const key = storageKeyFromPublicUrl(user.avatarUrl);
      if (key) await storage.deleteObject(key).catch(() => undefined);
      await prisma.user.update({ where: { id }, data: { avatarUrl: null } });
      reply.code(204);
      return null;
    }

    if (source === 'gallery') {
      const photo = await prisma.profilePhoto.findUnique({ where: { id } });
      if (!photo) throw app.httpErrors.notFound('Foto no encontrada');
      await storage.deleteObject(photo.storageKey).catch(() => undefined);
      await prisma.profilePhoto.delete({ where: { id } });
      reply.code(204);
      return null;
    }

    throw app.httpErrors.badRequest('Fuente de media no válida');
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
