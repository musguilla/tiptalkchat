import type { FastifyInstance, FastifyBaseLogger } from 'fastify';
import { z } from 'zod';
import { prisma } from '@tiptalk/db';
import { getStorage } from '../lib/storage.js';
import { canRequestPayout, PAYOUT_MIN_TIPSYS } from '@tiptalk/economy';
import { fetchPresence } from '../lib/realtime.js';
import {
  sendEmail,
  renderNewMessageEmail,
  renderNewFollowerEmail,
  renderNewContentEmail,
} from '../lib/email.js';

/**
 * Profile + gallery endpoints. The public surface is deliberately limited
 * to nick, avatar and photos explicitly marked as public; owner operations
 * remain authenticated.
 */

const galleryUploadBody = z.object({
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  bytes: z.number().int().positive().max(10 * 1024 * 1024),
  isPublic: z.boolean().default(false),
});

const updatePhotoBody = z.object({
  isPublic: z.boolean(),
});

/**
 * Email every follower of `authorId` that they have new content. Best-effort,
 * sequential, never throws. Callers should invoke it fire-and-forget and
 * debounce it upstream so bursts don't spam.
 */
async function notifyFollowersOfNewContent(
  authorId: string,
  log: FastifyBaseLogger,
): Promise<void> {
  try {
    const author = await prisma.user.findUnique({
      where: { id: authorId },
      select: { displayName: true },
    });
    if (!author) return;
    const followers = await prisma.follow.findMany({
      where: { followingId: authorId },
      take: 500,
      select: {
        follower: { select: { email: true, displayName: true, blockedAt: true } },
      },
    });
    for (const f of followers) {
      if (f.follower.blockedAt) continue;
      const { subject, html } = renderNewContentEmail({
        recipientName: f.follower.displayName,
        authorName: author.displayName,
        authorId,
      });
      const r = await sendEmail({ to: f.follower.email, subject, html });
      if (!r.ok && !r.skipped) log.warn({ err: r.error }, 'new-content email failed');
    }
  } catch (err) {
    log.warn({ err }, 'notifyFollowersOfNewContent failed');
  }
}

export async function userRoutes(app: FastifyInstance): Promise<void> {
  /**
   * Small, deliberately public discovery list for the home page. This only
   * exposes the information users have elected to surface through an avatar
   * (nick + avatar) — never email, rooms, wallets or gallery privacy state.
   * The two seeded demo identities must not leak into the production social
   * rail, hence the explicit demo-address exclusion instead of a fragile
   * "skip the first two rows" rule.
   */
  app.get('/discover', async (req) => {
    const viewerId = req.sessionUser?.userId ?? null;
    const [users, presence] = await Promise.all([
      prisma.user.findMany({
        where: {
          avatarUrl: { not: null },
          blockedAt: null,
          role: { not: 'admin' },
          email: { notIn: ['alice@tiptalk.demo', 'bob@tiptalk.demo'] },
        },
        orderBy: { updatedAt: 'desc' },
        take: 18,
        select: { id: true, displayName: true, avatarUrl: true },
      }),
      fetchPresence(),
    ]);
    const online = new Set(presence.onlineUserIds);
    let followed = new Set<string>();
    if (viewerId && users.length) {
      const mine = await prisma.follow.findMany({
        where: { followerId: viewerId, followingId: { in: users.map((u) => u.id) } },
        select: { followingId: true },
      });
      followed = new Set(mine.map((m) => m.followingId));
    }
    return {
      users: users.map((u) => ({
        ...u,
        online: online.has(u.id),
        isFollowing: followed.has(u.id),
      })),
    };
  });

  app.get('/:id', async (req) => {
    const id = (req.params as { id: string }).id;
    const viewerId = req.sessionUser?.userId ?? null;
    const [user, presence, followerCount, followingCount, follows] = await Promise.all([
      prisma.user.findUnique({
        where: { id },
        select: { id: true, displayName: true, avatarUrl: true, createdAt: true, blockedAt: true },
      }),
      fetchPresence(),
      prisma.follow.count({ where: { followingId: id } }),
      prisma.follow.count({ where: { followerId: id } }),
      viewerId && viewerId !== id
        ? prisma.follow.findUnique({
            where: { followerId_followingId: { followerId: viewerId, followingId: id } },
            select: { id: true },
          })
        : Promise.resolve(null),
    ]);
    if (!user || user.blockedAt) throw app.httpErrors.notFound('User not found');
    return {
      id: user.id,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      online: presence.onlineUserIds.includes(user.id),
      followerCount,
      followingCount,
      isFollowing: follows !== null,
    };
  });

  // --- Social graph: follow / unfollow + follower/following lists ---

  app.post('/:id/follow', async (req, reply) => {
    const me = await app.requireUser(req);
    const targetId = (req.params as { id: string }).id;
    if (targetId === me.userId) throw app.httpErrors.badRequest('No puedes seguirte a ti mismo');
    const target = await prisma.user.findUnique({
      where: { id: targetId },
      select: { id: true, email: true, displayName: true, blockedAt: true },
    });
    if (!target || target.blockedAt) throw app.httpErrors.notFound('Usuario no encontrado');

    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: me.userId, followingId: targetId } },
      select: { id: true },
    });
    if (!existing) {
      await prisma.follow.create({
        data: { followerId: me.userId, followingId: targetId },
      });
      // Notify the followed user by email (fire-and-forget, only on new follow).
      const meUser = await prisma.user.findUnique({
        where: { id: me.userId },
        select: { displayName: true },
      });
      const { subject, html } = renderNewFollowerEmail({
        recipientName: target.displayName,
        followerName: meUser?.displayName ?? 'Alguien',
        followerId: me.userId,
      });
      void sendEmail({ to: target.email, subject, html }).then((r) => {
        if (!r.ok && !r.skipped) req.log.warn({ err: r.error }, 'follow email failed');
      });
    }

    const followerCount = await prisma.follow.count({ where: { followingId: targetId } });
    reply.code(201);
    return { following: true, followerCount };
  });

  app.delete('/:id/follow', async (req) => {
    const me = await app.requireUser(req);
    const targetId = (req.params as { id: string }).id;
    await prisma.follow
      .delete({
        where: { followerId_followingId: { followerId: me.userId, followingId: targetId } },
      })
      .catch(() => undefined);
    const followerCount = await prisma.follow.count({ where: { followingId: targetId } });
    return { following: false, followerCount };
  });

  // Followers of :id  (people who follow them).
  app.get('/:id/followers', async (req) => {
    const id = (req.params as { id: string }).id;
    const viewerId = req.sessionUser?.userId ?? null;
    const [rows, presence] = await Promise.all([
      prisma.follow.findMany({
        where: { followingId: id },
        orderBy: { createdAt: 'desc' },
        take: 200,
        select: {
          follower: { select: { id: true, displayName: true, avatarUrl: true } },
        },
      }),
      fetchPresence(),
    ]);
    return buildUserList(rows.map((r) => r.follower), viewerId, presence.onlineUserIds);
  });

  // Following of :id  (people they follow).
  app.get('/:id/following', async (req) => {
    const id = (req.params as { id: string }).id;
    const viewerId = req.sessionUser?.userId ?? null;
    const [rows, presence] = await Promise.all([
      prisma.follow.findMany({
        where: { followerId: id },
        orderBy: { createdAt: 'desc' },
        take: 200,
        select: {
          following: { select: { id: true, displayName: true, avatarUrl: true } },
        },
      }),
      fetchPresence(),
    ]);
    return buildUserList(rows.map((r) => r.following), viewerId, presence.onlineUserIds);
  });

  // Shared helper: decorate a user list with online + isFollowing (viewer).
  async function buildUserList(
    users: Array<{ id: string; displayName: string; avatarUrl: string | null }>,
    viewerId: string | null,
    onlineIds: string[],
  ): Promise<{ users: Array<{ id: string; displayName: string; avatarUrl: string | null; online: boolean; isFollowing: boolean }> }> {
    const online = new Set(onlineIds);
    let followedByViewer = new Set<string>();
    if (viewerId && users.length) {
      const mine = await prisma.follow.findMany({
        where: { followerId: viewerId, followingId: { in: users.map((u) => u.id) } },
        select: { followingId: true },
      });
      followedByViewer = new Set(mine.map((m) => m.followingId));
    }
    return {
      users: users.map((u) => ({
        id: u.id,
        displayName: u.displayName,
        avatarUrl: u.avatarUrl,
        online: online.has(u.id),
        isFollowing: followedByViewer.has(u.id),
      })),
    };
  }

  /**
   * Public-facing gallery for a profile. Owner sees everything (with
   * isPublic flag). Other viewers see all photos but server only marks
   * which are public — the web treats private ones as blurred placeholders.
   * We still return the URLs for non-owner so the blur layer can sit on
   * top; if you want stronger privacy later we can return placeholders.
   */
  app.get('/:id/photos', async (req) => {
    const id = (req.params as { id: string }).id;
    const isSelf = req.sessionUser?.userId === id;
    // Non-owners get ALL photos, but private ones come back locked: no URL is
    // ever served (protegidas no se muestran), only the fact that they exist,
    // so the profile can show a locked card that invites messaging the owner.
    const photos = await prisma.profilePhoto.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, publicUrl: true, isPublic: true, createdAt: true },
    });
    return {
      photos: photos.map((p) => {
        const canSee = isSelf || p.isPublic;
        return {
          id: p.id,
          url: canSee ? p.publicUrl : null,
          isPublic: p.isPublic,
          createdAt: p.createdAt,
          viewerCanSee: canSee,
        };
      }),
    };
  });

  /**
   * Everything the owner of a profile needs to see about their own money, in
   * a single round-trip: balance, payout eligibility, Connect state, payout
   * history, recent ledger movements and tip totals. The self-view of
   * /u/[id] renders straight from this.
   */
  app.get('/me/overview', async (req) => {
    const { userId } = await app.requireUser(req);

    const [wallet, connect, payouts, recentLedger, tipsReceived, tipsSent] =
      await Promise.all([
        prisma.wallet.findUnique({ where: { userId }, select: { balance: true } }),
        prisma.connectAccount.findUnique({
          where: { userId },
          select: { status: true, payoutsEnabled: true, createdAt: true },
        }),
        prisma.payoutRequest.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: {
            id: true,
            tipsys: true,
            grossEurCents: true,
            feeEurCents: true,
            netEurCents: true,
            status: true,
            failureReason: true,
            createdAt: true,
            paidAt: true,
          },
        }),
        prisma.ledgerEntry.findMany({
          where: { wallet: { userId } },
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: { id: true, kind: true, amount: true, balanceAfter: true, createdAt: true },
        }),
        prisma.tip.aggregate({
          where: { receiverId: userId },
          _count: { _all: true },
          _sum: { amount: true },
        }),
        prisma.tip.aggregate({
          where: { senderId: userId },
          _count: { _all: true },
          _sum: { amount: true },
        }),
      ]);

    const balance = wallet?.balance ?? 0;
    return {
      wallet: {
        balance,
        payoutMin: PAYOUT_MIN_TIPSYS,
        canRequestPayout: canRequestPayout(balance),
      },
      connect: connect
        ? {
            connected: true,
            status: connect.status,
            payoutsEnabled: connect.payoutsEnabled,
            connectedAt: connect.createdAt,
          }
        : { connected: false, status: null, payoutsEnabled: false, connectedAt: null },
      payouts,
      recentLedger,
      tips: {
        received: { count: tipsReceived._count._all, tipsys: tipsReceived._sum.amount ?? 0 },
        sent: { count: tipsSent._count._all, tipsys: tipsSent._sum.amount ?? 0 },
      },
    };
  });

  /**
   * Sign an upload URL for a new gallery photo. The client then PUTs the
   * bytes directly to storage and follows up with POST /users/me/photos
   * to register the row in DB.
   */
  app.post('/me/photos/upload', async (req, reply) => {
    const me = await app.requireUser(req);
    const body = galleryUploadBody.parse(req.body);
    const storage = getStorage();
    const ticket = await storage.createGalleryUploadTicket({
      contentType: body.contentType,
      bytes: body.bytes,
      userId: me.userId,
    });
    reply.code(201);
    return {
      upload: {
        url: ticket.uploadUrl,
        method: ticket.method,
        headers: ticket.headers,
        expiresInSec: ticket.expiresInSec,
      },
      publicUrl: ticket.publicUrl,
      storageKey: ticket.storageKey,
    };
  });

  /**
   * Register a freshly-uploaded gallery photo. Called after the client
   * PUT to storage succeeded.
   */
  app.post('/me/photos', async (req, reply) => {
    const me = await app.requireUser(req);
    const body = z
      .object({
        publicUrl: z.string().url(),
        storageKey: z.string().min(1),
        isPublic: z.boolean().default(false),
      })
      .parse(req.body);
    const photo = await prisma.profilePhoto.create({
      data: {
        userId: me.userId,
        publicUrl: body.publicUrl,
        storageKey: body.storageKey,
        isPublic: body.isPublic,
      },
    });

    // Notify followers of new content, debounced to once per 6h per uploader
    // so a burst of uploads doesn't fan out a burst of emails.
    const sixHoursAgo = new Date(Date.now() - 6 * 3600 * 1000);
    const recentlyPosted = await prisma.profilePhoto.count({
      where: { userId: me.userId, id: { not: photo.id }, createdAt: { gte: sixHoursAgo } },
    });
    if (recentlyPosted === 0) void notifyFollowersOfNewContent(me.userId, req.log);

    reply.code(201);
    return {
      id: photo.id,
      url: photo.publicUrl,
      isPublic: photo.isPublic,
      createdAt: photo.createdAt,
    };
  });

  app.patch('/me/photos/:id', async (req) => {
    const me = await app.requireUser(req);
    const id = (req.params as { id: string }).id;
    const body = updatePhotoBody.parse(req.body);
    const owned = await prisma.profilePhoto.findFirst({
      where: { id, userId: me.userId },
    });
    if (!owned) throw app.httpErrors.notFound('Photo not found');
    const updated = await prisma.profilePhoto.update({
      where: { id },
      data: { isPublic: body.isPublic },
    });
    return {
      id: updated.id,
      url: updated.publicUrl,
      isPublic: updated.isPublic,
      createdAt: updated.createdAt,
    };
  });

  app.delete('/me/photos/:id', async (req, reply) => {
    const me = await app.requireUser(req);
    const id = (req.params as { id: string }).id;
    const owned = await prisma.profilePhoto.findFirst({
      where: { id, userId: me.userId },
    });
    if (!owned) throw app.httpErrors.notFound('Photo not found');
    const storage = getStorage();
    await storage.deleteObject(owned.storageKey);
    await prisma.profilePhoto.delete({ where: { id } });
    reply.code(204);
    return null;
  });
  // -------------------------------------------------------------------------
  // Direct messages (in-app inbox). A message to a user is stored and shown in
  // their inbox; the recipient also gets a best-effort email nudge.
  // -------------------------------------------------------------------------

  const sendMessageBody = z.object({ body: z.string().trim().min(1).max(4000) });

  app.post('/:id/messages', async (req, reply) => {
    const me = await app.requireUser(req);
    const toUserId = (req.params as { id: string }).id;
    if (toUserId === me.userId) throw app.httpErrors.badRequest('No puedes enviarte un mensaje a ti mismo');
    const { body } = sendMessageBody.parse(req.body);

    const [sender, recipient] = await Promise.all([
      prisma.user.findUnique({ where: { id: me.userId }, select: { displayName: true } }),
      prisma.user.findUnique({
        where: { id: toUserId },
        select: { id: true, email: true, displayName: true, blockedAt: true },
      }),
    ]);
    if (!recipient || recipient.blockedAt) throw app.httpErrors.notFound('Usuario no encontrado');

    const msg = await prisma.profileMessage.create({
      data: { fromUserId: me.userId, toUserId, body },
      select: { id: true, body: true, createdAt: true },
    });

    // Fire-and-forget email nudge. Never blocks or fails the request.
    const { subject, html } = renderNewMessageEmail({
      recipientName: recipient.displayName,
      senderName: sender?.displayName ?? 'Alguien',
    });
    void sendEmail({ to: recipient.email, subject, html }).then((r) => {
      if (!r.ok && !r.skipped) req.log.warn({ err: r.error }, 'message email failed');
    });

    reply.code(201);
    return { id: msg.id, body: msg.body, createdAt: msg.createdAt };
  });

  // Count of unread received messages, for the header badge.
  app.get('/me/messages/unread-count', async (req) => {
    const me = await app.requireUser(req);
    const count = await prisma.profileMessage.count({
      where: { toUserId: me.userId, readAt: null },
    });
    return { count };
  });

  // Inbox: one thread per counterpart, newest activity first.
  app.get('/me/messages', async (req) => {
    const me = await app.requireUser(req);
    const rows = await prisma.profileMessage.findMany({
      where: { OR: [{ toUserId: me.userId }, { fromUserId: me.userId }] },
      orderBy: { createdAt: 'desc' },
      take: 400,
      select: {
        id: true, body: true, createdAt: true, readAt: true,
        fromUserId: true, toUserId: true,
      },
    });

    // Group into per-counterpart threads (keep first = latest per partner).
    const threads = new Map<string, {
      partnerId: string; lastBody: string; lastAt: Date; unread: number;
    }>();
    for (const m of rows) {
      const partnerId = m.fromUserId === me.userId ? m.toUserId : m.fromUserId;
      let t = threads.get(partnerId);
      if (!t) {
        t = { partnerId, lastBody: m.body, lastAt: m.createdAt, unread: 0 };
        threads.set(partnerId, t);
      }
      if (m.toUserId === me.userId && m.readAt === null) t.unread += 1;
    }

    const partnerIds = [...threads.keys()];
    const [partners, presence] = await Promise.all([
      partnerIds.length
        ? prisma.user.findMany({
            where: { id: { in: partnerIds } },
            select: { id: true, displayName: true, avatarUrl: true },
          })
        : Promise.resolve([]),
      fetchPresence(),
    ]);
    const byId = new Map(partners.map((p) => [p.id, p]));
    const online = new Set(presence.onlineUserIds);

    const result = [...threads.values()]
      .map((t) => {
        const p = byId.get(t.partnerId);
        return {
          partner: {
            id: t.partnerId,
            displayName: p?.displayName ?? 'Usuario',
            avatarUrl: p?.avatarUrl ?? null,
            online: online.has(t.partnerId),
          },
          lastBody: t.lastBody,
          lastAt: t.lastAt,
          unread: t.unread,
        };
      })
      .sort((a, b) => b.lastAt.getTime() - a.lastAt.getTime());

    return { threads: result };
  });

  // Full conversation with one counterpart. Marks incoming as read.
  app.get('/me/messages/:userId', async (req) => {
    const me = await app.requireUser(req);
    const partnerId = (req.params as { userId: string }).userId;

    const [partner, presence, messages] = await Promise.all([
      prisma.user.findUnique({
        where: { id: partnerId },
        select: { id: true, displayName: true, avatarUrl: true },
      }),
      fetchPresence(),
      prisma.profileMessage.findMany({
        where: {
          OR: [
            { fromUserId: me.userId, toUserId: partnerId },
            { fromUserId: partnerId, toUserId: me.userId },
          ],
        },
        orderBy: { createdAt: 'asc' },
        take: 500,
        select: { id: true, body: true, createdAt: true, fromUserId: true, readAt: true },
      }),
    ]);
    if (!partner) throw app.httpErrors.notFound('Usuario no encontrado');

    await prisma.profileMessage.updateMany({
      where: { fromUserId: partnerId, toUserId: me.userId, readAt: null },
      data: { readAt: new Date() },
    });

    return {
      partner: {
        id: partner.id,
        displayName: partner.displayName,
        avatarUrl: partner.avatarUrl,
        online: presence.onlineUserIds.includes(partner.id),
      },
      messages: messages.map((m) => ({
        id: m.id,
        body: m.body,
        createdAt: m.createdAt,
        mine: m.fromUserId === me.userId,
      })),
    };
  });
}
