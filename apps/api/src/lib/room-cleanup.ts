import { prisma } from '@tiptalk/db';
import { loadEnv } from '@tiptalk/config';
import { getStorage } from './storage.js';
import { deleteMuxAssetByUploadId } from './video.js';

export const DEFAULT_ROOM_TTL_HOURS = 24;

export interface CleanupResult {
  mediaDeleted: number;
  messagesDeleted: number;
}

/**
 * Wipe everything in a room: delete media files (Supabase / Mux / S3), drop
 * MediaAsset rows, delete Message rows, and mark the Room as closed.
 *
 * Idempotent: re-running it on an already-closed room just becomes no-ops
 * because there will be no media/messages left.
 *
 * Tip records persist (audit trail / ledger reference) but their targetId
 * may now point at deleted rows — by design, since the Tipsys have already
 * been credited to the receiver and the spec wants nothing stored after
 * closure beyond the financial trail.
 */
export async function cleanupRoom(roomId: string): Promise<CleanupResult> {
  const env = loadEnv();
  const storage = getStorage();

  const mediaAssets = await prisma.mediaAsset.findMany({
    where: { messages: { some: { roomId } } },
  });

  let mediaDeleted = 0;
  for (const m of mediaAssets) {
    if (m.kind === 'image') {
      if (m.originalKey) {
        await storage.deleteObject(m.originalKey);
        mediaDeleted += 1;
      }
      if (m.thumbnailKey && m.thumbnailKey !== m.originalKey) {
        await storage.deleteObject(m.thumbnailKey);
      }
    } else if (m.kind === 'video') {
      if (m.hlsManifestKey?.startsWith('mux:')) {
        if (env.VIDEO_PROVIDER === 'mux' && m.originalKey) {
          await deleteMuxAssetByUploadId(m.originalKey);
          mediaDeleted += 1;
        }
      } else if (m.originalKey) {
        await storage.deleteObject(m.originalKey);
        if (m.hlsManifestKey) await storage.deleteObject(m.hlsManifestKey);
        if (m.thumbnailKey) await storage.deleteObject(m.thumbnailKey);
        mediaDeleted += 1;
      }
    }
  }

  await prisma.mediaAsset.deleteMany({
    where: { id: { in: mediaAssets.map((m) => m.id) } },
  });

  const msgResult = await prisma.message.deleteMany({ where: { roomId } });

  await prisma.room.update({
    where: { id: roomId },
    data: { closedAt: new Date() },
  });

  return { mediaDeleted, messagesDeleted: msgResult.count };
}

/**
 * Find every room that's past its expiresAt or older than 24h since creation
 * and hasn't been closed yet. Returns the cleanup results so callers can log.
 */
export async function sweepExpiredRooms(): Promise<Array<{ roomId: string } & CleanupResult>> {
  const cutoff = new Date(Date.now() - DEFAULT_ROOM_TTL_HOURS * 3600 * 1000);
  // Rooms owned by a registered user persist until the owner explicitly
  // hits 'Cerrar sala'. The 24h sweep only catches anonymous-host rooms
  // (creatorId null) — those have no way to come back without the host
  // token, so they'd dangle forever otherwise.
  const expired = await prisma.room.findMany({
    where: {
      closedAt: null,
      creatorId: null,
      OR: [{ expiresAt: { lt: new Date() } }, { createdAt: { lt: cutoff } }],
    },
    select: { id: true },
  });
  const results: Array<{ roomId: string } & CleanupResult> = [];
  for (const r of expired) {
    try {
      const res = await cleanupRoom(r.id);
      results.push({ roomId: r.id, ...res });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`[sweeper] failed to clean room ${r.id}:`, err);
    }
  }
  return results;
}
