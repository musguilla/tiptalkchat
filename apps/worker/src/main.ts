import { Queue, Worker, type Job } from 'bullmq';
import { Redis } from 'ioredis';
import { loadEnv } from '@tiptalk/config';
import { prisma } from '@tiptalk/db';
import { processVideoJob, processImageJob } from './transcoder.js';

const env = loadEnv();
const connection = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });

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

// eslint-disable-next-line no-console
console.info('[worker] listening for media jobs on Redis', env.REDIS_URL);
