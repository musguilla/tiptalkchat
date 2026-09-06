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

// Presence changes slowly relative to how often the admin panel asks for it
// (every list/detail/stats request). A 5s cache turns N HTTP hops per
// dashboard refresh into 1, and coalesces concurrent requests onto a single
// in-flight fetch so a burst of tabs doesn't fan out to realtime.
const PRESENCE_TTL_MS = 5_000;
let presenceCache: { at: number; value: PresenceSnapshot } | null = null;
let presenceInFlight: Promise<PresenceSnapshot> | null = null;

/**
 * Snapshot of who's connected right now, from the realtime server, cached
 * for 5s. Never throws — if realtime is down or slow (1.5s timeout) we return
 * the last good snapshot if we have one, else an empty one, so the admin
 * panel still renders (just with everyone offline).
 */
export async function fetchPresence(): Promise<PresenceSnapshot> {
  const now = Date.now();
  if (presenceCache && now - presenceCache.at < PRESENCE_TTL_MS) return presenceCache.value;
  if (presenceInFlight) return presenceInFlight;

  presenceInFlight = (async () => {
    const env = loadEnv();
    const url = `${env.REALTIME_URL.replace(/\/$/, '')}/internal/presence`;
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${env.JWT_ACCESS_SECRET}` },
        signal: AbortSignal.timeout(1500),
      });
      if (!res.ok) return presenceCache?.value ?? EMPTY_PRESENCE;
      const data = (await res.json()) as Partial<PresenceSnapshot>;
      const value: PresenceSnapshot = {
        onlineUserIds: Array.isArray(data.onlineUserIds) ? data.onlineUserIds : [],
        roomCounts: data.roomCounts && typeof data.roomCounts === 'object' ? data.roomCounts : {},
        totalSockets: typeof data.totalSockets === 'number' ? data.totalSockets : 0,
      };
      presenceCache = { at: Date.now(), value };
      return value;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[realtime] presence fetch failed', err);
      return presenceCache?.value ?? EMPTY_PRESENCE;
    } finally {
      presenceInFlight = null;
    }
  })();
  return presenceInFlight;
}
