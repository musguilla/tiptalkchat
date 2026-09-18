import { prisma } from '@tiptalk/db';

export const DEFAULT_ROOM_TTL_HOURS = 24;

export interface CleanupResult {
  mediaDeleted: number;
  messagesDeleted: number;
}

/**
 * Close a room without destroying its media. Deletes the *text* conversation
 * (text/system messages) for privacy, but KEEPS every MediaAsset (and its file
 * in storage / Mux) plus the image/video messages that carry it, so the media
 * stays visible — with its room and uploader context — in the admin Media view
 * even after the room expires or is closed.
 *
 * Idempotent: re-running on an already-closed room just deletes nothing more.
 *
 * Tip records persist (audit trail / ledger reference) even if their targetId
 * now points at deleted text rows — by design.
 */
export async function cleanupRoom(roomId: string): Promise<CleanupResult> {
  // Media is preserved on purpose (see doc above): we no longer delete files
  // or MediaAsset rows, and we keep the messages that carry media so the
  // room/uploader association survives.
  const msgResult = await prisma.message.deleteMany({
    where: { roomId, mediaId: null },
  });

  await prisma.room.update({
    where: { id: roomId },
    data: { closedAt: new Date() },
  });

  return { mediaDeleted: 0, messagesDeleted: msgResult.count };
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
