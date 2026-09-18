import type { FastifyInstance } from 'fastify';
import { prisma } from '@tiptalk/db';
import { loadEnv } from '@tiptalk/config';
import {
  livekitConfigured,
  recordingConfigured,
  roomServiceClient,
  egressClient,
  hiddenObserverToken,
  livekitRoomName,
  buildRecordingOutput,
} from '../lib/livekit.js';

/**
 * Admin moderation tools for LIVE calls. Every handler is admin-gated.
 *
 * The moderator observes as a HIDDEN LiveKit participant: it receives every
 * track but never appears in the roster and cannot publish — the users in the
 * call are never told a moderator joined (disclosed once, up-front, in the
 * terms of service moderation clause). Optional recording uses LiveKit Egress.
 */
export async function adminCallRoutes(app: FastifyInstance): Promise<void> {
  /**
   * List calls that are live RIGHT NOW. Ground truth is LiveKit itself
   * (listRooms), mapped back to our Room records via the `tiptalk:<slug>`
   * naming. Also flags which rooms currently have a recording running.
   */
  app.get('/', async (req) => {
    await app.requireAdmin(req);
    if (!livekitConfigured()) {
      return { configured: false, recordingAvailable: false, calls: [] };
    }

    const svc = roomServiceClient();
    const lkRooms = await svc.listRooms();
    const active = lkRooms.filter((r) => r.numParticipants > 0 && r.name.startsWith('tiptalk:'));

    // Map LiveKit room names back to our slugs / Room rows.
    const slugs = active.map((r) => r.name.replace(/^tiptalk:/, ''));
    const rooms = slugs.length
      ? await prisma.room.findMany({
          where: { slug: { in: slugs } },
          select: {
            id: true,
            slug: true,
            name: true,
            closedAt: true,
            creator: { select: { id: true, displayName: true, avatarUrl: true } },
            creatorGuest: { select: { id: true, displayName: true } },
          },
        })
      : [];
    const bySlug = new Map(rooms.map((r) => [r.slug, r]));

    // Which rooms have an active recording (from our DB, cheap + reliable).
    const activeRecs = await prisma.callRecording.findMany({
      where: { status: 'active', room: { slug: { in: slugs } } },
      select: { roomId: true, id: true, egressId: true, startedAt: true },
    });
    const recByRoomId = new Map(activeRecs.map((r) => [r.roomId, r]));

    const calls = active.map((lk) => {
      const slug = lk.name.replace(/^tiptalk:/, '');
      const room = bySlug.get(slug) ?? null;
      const rec = room ? recByRoomId.get(room.id) ?? null : null;
      return {
        roomId: room?.id ?? null,
        slug,
        name: room?.name ?? slug,
        closed: room?.closedAt != null,
        participants: lk.numParticipants,
        startedAt: lk.creationTime ? Number(lk.creationTime) * 1000 : null,
        creator: room
          ? room.creator
            ? {
                kind: 'user' as const,
                id: room.creator.id,
                displayName: room.creator.displayName,
                avatarUrl: room.creator.avatarUrl,
              }
            : room.creatorGuest
              ? {
                  kind: 'guest' as const,
                  id: room.creatorGuest.id,
                  displayName: room.creatorGuest.displayName,
                  avatarUrl: null,
                }
              : null
          : null,
        recording: rec
          ? { id: rec.id, egressId: rec.egressId, startedAt: rec.startedAt }
          : null,
      };
    });

    // Newest calls first.
    calls.sort((a, b) => (b.startedAt ?? 0) - (a.startedAt ?? 0));

    return {
      configured: true,
      recordingAvailable: recordingConfigured(),
      calls,
    };
  });

  /**
   * Issue a hidden observer token for a room. The moderator joins LiveKit
   * invisibly (hidden: true, canPublish: false).
   */
  app.post('/:roomId/observe-token', async (req) => {
    const admin = await app.requireAdmin(req);
    if (!livekitConfigured()) {
      throw app.httpErrors.badRequest('LiveKit no está configurado como SFU.');
    }
    const roomId = (req.params as { roomId: string }).roomId;
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { slug: true },
    });
    if (!room) throw app.httpErrors.notFound('Sala no encontrada');

    const me = await prisma.user.findUnique({
      where: { id: admin.userId },
      select: { displayName: true },
    });

    return hiddenObserverToken({
      roomSlug: room.slug,
      adminId: admin.userId,
      adminName: me?.displayName ?? 'Moderación',
    });
  });

  /**
   * Start a moderation recording (room-composite → S3). Idempotent-ish: if one
   * is already running for the room we return it instead of double-recording.
   */
  app.post('/:roomId/recording/start', async (req) => {
    const admin = await app.requireAdmin(req);
    if (!recordingConfigured()) {
      throw app.httpErrors.badRequest(
        'La grabación no está configurada. Añade las claves LIVEKIT_RECORD_S3_* en el entorno.',
      );
    }
    const roomId = (req.params as { roomId: string }).roomId;
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true, slug: true },
    });
    if (!room) throw app.httpErrors.notFound('Sala no encontrada');

    const existing = await prisma.callRecording.findFirst({
      where: { roomId: room.id, status: 'active' },
    });
    if (existing) {
      return { id: existing.id, egressId: existing.egressId, status: existing.status, already: true };
    }

    const env = loadEnv();
    const fileKey = `moderation/${room.slug}/${Date.now()}.mp4`;
    const output = buildRecordingOutput(fileKey);

    const egress = egressClient();
    const info = await egress.startRoomCompositeEgress(livekitRoomName(room.slug), output, {
      layout: 'grid',
    });

    const fileUrl = env.LIVEKIT_RECORD_S3_ENDPOINT
      ? `${env.LIVEKIT_RECORD_S3_ENDPOINT.replace(/\/$/, '')}/${env.LIVEKIT_RECORD_S3_BUCKET}/${fileKey}`
      : null;

    const rec = await prisma.callRecording.create({
      data: {
        roomId: room.id,
        egressId: info.egressId,
        status: 'active',
        startedById: admin.userId,
        fileKey,
        fileUrl,
      },
    });

    return { id: rec.id, egressId: rec.egressId, status: rec.status, already: false };
  });

  /** Stop the active recording for a room. */
  app.post('/:roomId/recording/stop', async (req) => {
    await app.requireAdmin(req);
    const roomId = (req.params as { roomId: string }).roomId;

    const rec = await prisma.callRecording.findFirst({
      where: { roomId, status: 'active' },
      orderBy: { startedAt: 'desc' },
    });
    if (!rec) throw app.httpErrors.notFound('No hay ninguna grabación activa en esta sala');

    try {
      await egressClient().stopEgress(rec.egressId);
    } catch (err) {
      req.log.warn({ err, egressId: rec.egressId }, 'stopEgress failed (marking complete anyway)');
    }

    const updated = await prisma.callRecording.update({
      where: { id: rec.id },
      data: { status: 'complete', endedAt: new Date() },
    });

    return { id: updated.id, status: updated.status };
  });

  /** Recording history (for the moderation archive view). */
  app.get('/recordings', async (req) => {
    await app.requireAdmin(req);
    const recordings = await prisma.callRecording.findMany({
      orderBy: { startedAt: 'desc' },
      take: 100,
      select: {
        id: true,
        status: true,
        startedAt: true,
        endedAt: true,
        fileUrl: true,
        durationSec: true,
        room: { select: { id: true, slug: true, name: true } },
      },
    });
    return { recordings, recordingAvailable: recordingConfigured() };
  });
}
