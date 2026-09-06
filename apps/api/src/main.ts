import { buildApp } from './app.js';
import { sweepExpiredRooms } from './lib/room-cleanup.js';
import { loadEnv } from '@tiptalk/config';

const PORT = Number(process.env.PORT ?? 4000);
const HOST = process.env.HOST ?? '0.0.0.0';
const SWEEP_INTERVAL_MS = 10 * 60 * 1000; // every 10 minutes

async function runSweeper(): Promise<void> {
  try {
    const results = await sweepExpiredRooms();
    if (results.length > 0) {
      // eslint-disable-next-line no-console
      console.info(
        `[sweeper] closed ${results.length} expired room(s):`,
        results.map((r) => `${r.roomId} (${r.mediaDeleted} files, ${r.messagesDeleted} msgs)`),
      );
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[sweeper] iteration failed:', err);
  }
}

/**
 * A short JWT_ACCESS_TTL logs everyone out silently and is painful to
 * diagnose from the outside (it just looks like "the app keeps logging me
 * out"). Shout about it at boot so it can never hide again.
 */
function warnOnShortSessionTtl(): void {
  const ttl = loadEnv().JWT_ACCESS_TTL.trim();
  const m = /^(\d+)\s*([smhdw])$/i.exec(ttl);
  if (!m) return;
  const mult: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400, w: 604800 };
  const seconds = Number(m[1]) * (mult[m[2]!.toLowerCase()] ?? 0);
  if (seconds > 0 && seconds < 3600) {
    // eslint-disable-next-line no-console
    console.warn(
      `[auth] JWT_ACCESS_TTL=${ttl} — sessions expire in under an hour, users will be logged out constantly. Set it to something like 365d.`,
    );
  }
}

async function start(): Promise<void> {
  warnOnShortSessionTtl();
  const app = await buildApp();
  try {
    await app.listen({ port: PORT, host: HOST });
    // eslint-disable-next-line no-console
    console.info(`[api] listening on ${HOST}:${PORT}`);

    // First sweep after a short delay so deploys don't race; then on interval.
    setTimeout(() => void runSweeper(), 30_000);
    setInterval(() => void runSweeper(), SWEEP_INTERVAL_MS);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
