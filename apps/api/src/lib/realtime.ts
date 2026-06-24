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
