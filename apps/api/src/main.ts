import { buildApp } from './app.js';
import { sweepExpiredRooms } from './lib/room-cleanup.js';

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

async function start(): Promise<void> {
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
