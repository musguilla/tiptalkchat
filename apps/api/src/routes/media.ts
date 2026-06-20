import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@tiptalk/db';
import { getStorage } from '../lib/storage.js';
import { createVideoUploadTicket, muxHlsUrl, muxThumbnailUrl } from '../lib/video.js';

const imageBody = z.object({
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  bytes: z.number().int().positive().max(50 * 1024 * 1024),
});

const videoBody = z.object({
  bytes: z.number().int().positive().max(500 * 1024 * 1024),
});

const completeImageBody = z.object({
  mediaId: z.string(),
});

export async function mediaRoutes(app: FastifyInstance): Promise<void> {
  app.post('/image/upload', async (req, reply) => {
    const { userId } = await app.requireUser(req);
    const body = imageBody.parse(req.body);

    const storage = getStorage();
    const ticket = await storage.createImageUploadTicket({
      contentType: body.contentType,
      bytes: body.bytes,
    });

    const asset = await prisma.mediaAsset.create({
      data: {
        ownerId: userId,
        kind: 'image',
        status: 'uploaded', // client will mark complete after upload
        originalKey: ticket.storageKey,
        bytes: body.bytes,
        mimeType: body.contentType,
      },
    });

    reply.code(201);
    return {
      mediaId: asset.id,
      upload: {
        url: ticket.uploadUrl,
        method: ticket.method,
        headers: ticket.headers,
        expiresInSec: ticket.expiresInSec,
      },
      publicUrl: ticket.publicUrl,
    };
  });

  app.post('/image/complete', async (req) => {
    const { userId } = await app.requireUser(req);
    const body = completeImageBody.parse(req.body);
    const asset = await prisma.mediaAsset.findUnique({ where: { id: body.mediaId } });
    if (!asset || asset.ownerId !== userId) {
      throw app.httpErrors.notFound('Media not found');
    }
    const updated = await prisma.mediaAsset.update({
      where: { id: body.mediaId },
      data: { status: 'ready', thumbnailKey: asset.originalKey },
    });
    return updated;
  });

  app.post('/video/upload', async (req, reply) => {
    const { userId } = await app.requireUser(req);
    videoBody.parse(req.body);

    const ticket = await createVideoUploadTicket();
    const asset = await prisma.mediaAsset.create({
      data: {
        ownerId: userId,
        kind: 'video',
        status: 'uploaded',
        originalKey: ticket.providerRef,
        bytes: 0,
        mimeType: 'video/mp4',
      },
    });

    reply.code(201);
    return {
      mediaId: asset.id,
      provider: ticket.provider,
      upload: {
        url: ticket.uploadUrl,
        method: ticket.method,
        headers: ticket.headers,
        expiresInSec: ticket.expiresInSec,
      },
    };
  });

  app.get('/:id', async (req) => {
    const id = (req.params as { id: string }).id;
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) throw app.httpErrors.notFound('Media not found');

    if (asset.kind === 'video' && asset.hlsManifestKey?.startsWith('mux:')) {
      const playbackId = asset.hlsManifestKey.replace(/^mux:/, '');
      return {
        ...asset,
        hlsUrl: muxHlsUrl(playbackId),
        thumbnailUrl: muxThumbnailUrl(playbackId, { time: 1, width: 480 }),
      };
    }
    return asset;
  });
}
