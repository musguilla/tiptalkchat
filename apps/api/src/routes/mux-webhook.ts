import type { FastifyInstance } from 'fastify';
import { prisma } from '@tiptalk/db';
import { verifyMuxWebhook } from '../lib/video.js';

interface MuxEvent {
  type: string;
  data: {
    id?: string;
    upload_id?: string;
    playback_ids?: Array<{ id: string; policy: string }>;
    duration?: number;
    status?: string;
  };
}

export async function muxWebhookRoute(app: FastifyInstance): Promise<void> {
  app.addContentTypeParser(
    'application/json',
    { parseAs: 'buffer' },
    (_req, body, done) => done(null, body),
  );

  app.post('/', async (req, reply) => {
    const sig =
      typeof req.headers['mux-signature'] === 'string' ? req.headers['mux-signature'] : undefined;
    const raw = req.body as Buffer;

    if (!verifyMuxWebhook(raw, sig)) {
      throw app.httpErrors.badRequest('Invalid Mux signature');
    }

    let event: MuxEvent;
    try {
      event = JSON.parse(raw.toString('utf8')) as MuxEvent;
    } catch {
      throw app.httpErrors.badRequest('Invalid JSON');
    }

    switch (event.type) {
      case 'video.asset.ready': {
        const playback = event.data.playback_ids?.find((p) => p.policy === 'public');
        const uploadId = event.data.upload_id;
        if (playback && uploadId) {
          // Find the MediaAsset that captured this upload as its originalKey
          await prisma.mediaAsset.updateMany({
            where: { originalKey: uploadId, kind: 'video' },
            data: {
              status: 'ready',
              hlsManifestKey: `mux:${playback.id}`,
              thumbnailKey: `mux-thumb:${playback.id}`,
              durationMs: event.data.duration ? Math.round(event.data.duration * 1000) : null,
            },
          });
        }
        break;
      }

      case 'video.asset.errored': {
        const uploadId = event.data.upload_id;
        if (uploadId) {
          await prisma.mediaAsset.updateMany({
            where: { originalKey: uploadId },
            data: { status: 'failed' },
          });
        }
        break;
      }

      default:
        break;
    }

    reply.code(200);
    return { received: true };
  });
}
