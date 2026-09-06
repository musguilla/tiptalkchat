import { loadEnv } from '@tiptalk/config';

/**
 * Fire-and-forget broadcast to the realtime server. Used after a DB write
 * (message, tip, ...) so other participants get the event without depending
 * on the sending client's socket being connected.
 */
export async function broadcastToRoom(
  event: string,
  roomId: string,
  payload: unknown,
): Promise<void> {
  const env = loadEnv();
  const url = `${env.REALTIME_URL.replace(/\/$/, '')}/internal/broadcast`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.JWT_ACCESS_SECRET}`,
      },
      body: JSON.stringify({ event, roomId, payload }),
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[realtime] broadcast failed: ${event} → ${roomId}`, err);
  }
}

export interface PresenceSnapshot {
  onlineUserIds: string[];
  roomCounts: Record<string, number>;
  totalSockets: number;
}

const EMPTY_PRESENCE: PresenceSnapshot = { onlineUserIds: [], roomCounts: {}, totalSockets: 0 };

/**
 * Snapshot of who's connected right now, straight from the realtime server.
 * Never throws — if realtime is down or slow (2s timeout) we return an empty
 * snapshot so the admin panel still renders, just with everyone offline.
 */
export async function fetchPresence(): Promise<PresenceSnapshot> {
  const env = loadEnv();
  const url = `${env.REALTIME_URL.replace(/\/$/, '')}/internal/presence`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${env.JWT_ACCESS_SECRET}` },
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return EMPTY_PRESENCE;
    const data = (await res.json()) as Partial<PresenceSnapshot>;
    return {
      onlineUserIds: Array.isArray(data.onlineUserIds) ? data.onlineUserIds : [],
      roomCounts: data.roomCounts && typeof data.roomCounts === 'object' ? data.roomCounts : {},
      totalSockets: typeof data.totalSockets === 'number' ? data.totalSockets : 0,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[realtime] presence fetch failed', err);
    return EMPTY_PRESENCE;
  }
}
