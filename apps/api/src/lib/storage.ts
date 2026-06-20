/**
 * Storage abstraction for image uploads. Two providers wired in:
 *   - Supabase Storage (default when SUPABASE_URL + SUPABASE_SERVICE_KEY set)
 *   - S3 / R2 / MinIO (S3-compatible) with presigned PUT URLs
 *
 * Videos go through a different path (Mux Direct Upload) — see lib/video.ts.
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { loadEnv } from '@tiptalk/config';
import { randomUUID } from 'node:crypto';

export interface UploadTicket {
  uploadUrl: string;
  method: 'PUT' | 'POST';
  headers: Record<string, string>;
  /** Stable key the client will not be able to change. Persist on MediaAsset. */
  storageKey: string;
  /** URL the file will be available at AFTER the client completes the upload. */
  publicUrl: string;
  expiresInSec: number;
}

export interface StorageProvider {
  createImageUploadTicket(input: { contentType: string; bytes: number }): Promise<UploadTicket>;
  getPublicUrl(storageKey: string): string;
}

let cached: StorageProvider | null = null;

export function getStorage(): StorageProvider {
  if (cached) return cached;
  const env = loadEnv();
  const provider =
    env.STORAGE_PROVIDER ??
    (env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY ? 'supabase' : 's3');
  cached =
    provider === 'supabase' ? buildSupabaseProvider() : buildS3Provider();
  return cached;
}

function buildSupabaseProvider(): StorageProvider {
  const env = loadEnv();
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
    throw new Error('Supabase storage selected but SUPABASE_URL / SUPABASE_SERVICE_KEY missing');
  }
  const base = env.SUPABASE_URL.replace(/\/$/, '');
  const bucket = env.SUPABASE_BUCKET;

  return {
    async createImageUploadTicket({ contentType }) {
      const storageKey = `images/${todayPath()}/${randomUUID()}${extFromMime(contentType)}`;

      // Supabase Storage: ask the API for a signed upload URL the browser can PUT to.
      const res = await fetch(
        `${base}/storage/v1/object/upload/sign/${bucket}/${storageKey}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ expiresIn: 300 }),
        },
      );
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Supabase signed upload failed (${res.status}): ${body}`);
      }
      const { url, token } = (await res.json()) as { url: string; token: string };
      // Some Supabase versions return a relative URL; normalize.
      const uploadUrl = url.startsWith('http') ? url : `${base}${url}`;

      return {
        uploadUrl,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': contentType,
          'x-upsert': 'false',
        },
        storageKey,
        publicUrl: `${base}/storage/v1/object/public/${bucket}/${storageKey}`,
        expiresInSec: 300,
      };
    },

    getPublicUrl(storageKey: string) {
      return `${base}/storage/v1/object/public/${bucket}/${storageKey}`;
    },
  };
}

function buildS3Provider(): StorageProvider {
  const env = loadEnv();
  const client = new S3Client({
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION,
    forcePathStyle: true,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
    },
  });
  return {
    async createImageUploadTicket({ contentType }) {
      const storageKey = `images/${todayPath()}/${randomUUID()}${extFromMime(contentType)}`;
      const url = await getSignedUrl(
        client,
        new PutObjectCommand({
          Bucket: env.S3_BUCKET,
          Key: storageKey,
          ContentType: contentType,
        }),
        { expiresIn: 300 },
      );
      return {
        uploadUrl: url,
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        storageKey,
        publicUrl: `${env.S3_PUBLIC_URL.replace(/\/$/, '')}/${storageKey}`,
        expiresInSec: 300,
      };
    },
    getPublicUrl(storageKey: string) {
      return `${env.S3_PUBLIC_URL.replace(/\/$/, '')}/${storageKey}`;
    },
  };
}

export async function presignedGetUrl(storageKey: string, expiresInSec = 300): Promise<string> {
  const env = loadEnv();
  if (
    (env.STORAGE_PROVIDER ?? (env.SUPABASE_URL ? 'supabase' : 's3')) === 'supabase' &&
    env.SUPABASE_URL
  ) {
    return `${env.SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${env.SUPABASE_BUCKET}/${storageKey}`;
  }
  const client = new S3Client({
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION,
    forcePathStyle: true,
    credentials: { accessKeyId: env.S3_ACCESS_KEY, secretAccessKey: env.S3_SECRET_KEY },
  });
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: storageKey }),
    { expiresIn: expiresInSec },
  );
}

function todayPath(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}/${pad(d.getUTCMonth() + 1)}/${pad(d.getUTCDate())}`;
}
function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}
function extFromMime(m: string): string {
  if (m === 'image/jpeg') return '.jpg';
  if (m === 'image/png') return '.png';
  if (m === 'image/webp') return '.webp';
  if (m === 'image/gif') return '.gif';
  return '';
}
