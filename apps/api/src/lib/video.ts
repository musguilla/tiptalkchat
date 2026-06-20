/**
 * Video upload pipeline. Two backends:
 *   - 'mux': Mux Direct Upload + webhooks (production). HLS + thumbnails + CDN.
 *   - 'local': returns an S3 presigned PUT URL; apps/worker (ffmpeg) handles transcode.
 *
 * The client always calls the same endpoint and gets a uniform UploadTicket.
 * The MediaAsset's `kind` is 'video' and its state machine ends in 'ready'
 * either via the Mux webhook (`POST /webhooks/mux`) or the worker.
 */

import Mux from '@mux/mux-node';
import { loadEnv } from '@tiptalk/config';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { getStorage } from './storage.js';

export interface VideoUploadTicket {
  uploadUrl: string;
  method: 'PUT' | 'POST';
  headers: Record<string, string>;
  /** For 'mux' this is the upload ID; for 'local' this is the S3 key. */
  providerRef: string;
  provider: 'mux' | 'local';
  expiresInSec: number;
}

let muxClient: Mux | null = null;

function getMux(): Mux {
  if (muxClient) return muxClient;
  const env = loadEnv();
  if (!env.MUX_TOKEN_ID || !env.MUX_TOKEN_SECRET) {
    throw new Error('VIDEO_PROVIDER=mux but MUX_TOKEN_ID / MUX_TOKEN_SECRET are missing');
  }
  muxClient = new Mux({
    tokenId: env.MUX_TOKEN_ID,
    tokenSecret: env.MUX_TOKEN_SECRET,
  });
  return muxClient;
}

export async function createVideoUploadTicket(): Promise<VideoUploadTicket> {
  const env = loadEnv();
  if (env.VIDEO_PROVIDER === 'mux') {
    const mux = getMux();
    const upload = await mux.video.uploads.create({
      cors_origin: env.PUBLIC_BASE_URL,
      new_asset_settings: {
        playback_policy: ['public'],
        encoding_tier: 'baseline',
      },
    });
    return {
      uploadUrl: upload.url,
      method: 'PUT',
      headers: { 'Content-Type': 'application/octet-stream' },
      providerRef: upload.id,
      provider: 'mux',
      expiresInSec: 3600,
    };
  }

  // Local fallback: upload to S3/MinIO, worker transcodes.
  const storage = getStorage();
  const ticket = await storage.createImageUploadTicket({
    contentType: 'video/mp4',
    bytes: 0,
  });
  return {
    uploadUrl: ticket.uploadUrl,
    method: ticket.method,
    headers: ticket.headers,
    providerRef: ticket.storageKey,
    provider: 'local',
    expiresInSec: ticket.expiresInSec,
  };
}

/**
 * Build the HLS playback URL for a Mux asset. Uses the public policy playback ID
 * created on the asset. We only persist playbackId on MediaAsset.hlsManifestKey
 * for the Mux path.
 */
export function muxHlsUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

export function muxThumbnailUrl(playbackId: string, opts?: { time?: number; width?: number }): string {
  const params = new URLSearchParams();
  if (opts?.time != null) params.set('time', String(opts.time));
  if (opts?.width != null) params.set('width', String(opts.width));
  const q = params.toString();
  return `https://image.mux.com/${playbackId}/thumbnail.jpg${q ? `?${q}` : ''}`;
}

/**
 * Verify a Mux webhook signature header of the form `t=<timestamp>,v1=<hex hmac>`.
 * Mux computes HMAC-SHA256 of `${timestamp}.${rawBody}` keyed with the webhook
 * signing secret.
 *
 * Returns true if the signature is valid OR if no secret is configured (dev).
 * Includes a 5-minute replay-protection window on the timestamp.
 */
export function verifyMuxWebhook(rawBody: Buffer, signatureHeader: string | undefined): boolean {
  const env = loadEnv();
  if (!env.MUX_WEBHOOK_SECRET) return true; // dev: skip verification
  if (!signatureHeader) return false;
  const parts = Object.fromEntries(
    signatureHeader.split(',').map((kv) => {
      const i = kv.indexOf('=');
      return [kv.slice(0, i), kv.slice(i + 1)];
    }),
  ) as { t?: string; v1?: string };
  if (!parts.t || !parts.v1) return false;
  const tsSec = Number(parts.t);
  if (!Number.isFinite(tsSec)) return false;
  if (Math.abs(Date.now() / 1000 - tsSec) > 300) return false;
  const expected = createHmac('sha256', env.MUX_WEBHOOK_SECRET)
    .update(`${parts.t}.${rawBody.toString('utf8')}`)
    .digest();
  let received: Buffer;
  try {
    received = Buffer.from(parts.v1, 'hex');
  } catch {
    return false;
  }
  if (received.length !== expected.length) return false;
  return timingSafeEqual(expected, received);
}
