import { Queue, Worker, type Job } from 'bullmq';
import { Redis } from 'ioredis';
import { loadEnv } from '@tiptalk/config';
import { prisma } from '@tiptalk/db';
import { processVideoJob, processImageJob } from './transcoder.js';

const env = loadEnv();
const connection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // required by BullMQ
  // Reconnect with exponential backoff capped at 30s instead of hammering.
  retryStrategy(times) {
    return Math.min(1000 * 2 ** Math.min(times, 5), 30_000);
  },
});

// Print Redis-down warnings once per minute instead of every reconnect attempt.
let lastWarn = 0;
connection.on('error', (err) => {
  const now = Date.now();
  if (now - lastWarn > 60_000) {
    lastWarn = now;
    // eslint-disable-next-line no-console
    console.warn(
      `[worker] Redis unreachable at ${env.REDIS_URL} (${err.message}). ` +
        `Start it with: docker compose up -d redis  (or brew services start redis). ` +
        `Will keep retrying silently…`,
    );
  }
});

export const mediaQueue = new Queue('media', { connection });

interface MediaJobData {
  mediaId: string;
  s3Key: string;
  kind: 'image' | 'video';
}

const worker = new Worker<MediaJobData>(
  'media',
  async (job: Job<MediaJobData>) => {
    const { mediaId, kind, s3Key } = job.data;
    await prisma.mediaAsset.update({ where: { id: mediaId }, data: { status: 'processing' } });

    try {
      if (kind === 'image') {
        const result = await processImageJob(s3Key);
        await prisma.mediaAsset.update({
          where: { id: mediaId },
          data: { status: 'ready', thumbnailKey: result.thumbnailKey },
        });
      } else {
        const result = await processVideoJob(s3Key);
        await prisma.mediaAsset.update({
          where: { id: mediaId },
          data: {
            status: 'ready',
            thumbnailKey: result.thumbnailKey,
            hlsManifestKey: result.hlsManifestKey,
            durationMs: result.durationMs,
          },
        });
      }
    } catch (err) {
      await prisma.mediaAsset.update({ where: { id: mediaId }, data: { status: 'failed' } });
      throw err;
    }
  },
  { connection, concurrency: 4 },
);

worker.on('failed', (job, err) => {
  // eslint-disable-next-line no-console
  console.error(`[worker] job ${job?.id} failed:`, err);
});

worker.on('completed', (job) => {
  // eslint-disable-next-line no-console
  console.info(`[worker] job ${job.id} done`);
});

// BullMQ duplicates the Redis connection internally; that duplicate doesn't
// inherit our error listener, so the worker.on('error') hook below catches
// connection-level errors (ECONNREFUSED, etc.) and the same throttle applies.
worker.on('error', (err) => {
  const now = Date.now();
  if (now - lastWarn > 60_000) {
    lastWarn = now;
    // eslint-disable-next-line no-console
    console.warn(`[worker] connection error (will retry): ${err.message}`);
  }
});

// eslint-disable-next-line no-console
console.info('[worker] listening for media jobs on Redis', env.REDIS_URL);
