/**
 * Compute viewable URLs for a MediaAsset row so the client doesn't need to
 * know about Supabase Storage / S3 / Mux internals.
 *
 *   - image: publicUrl from STORAGE_PROVIDER
 *   - video uploaded to Mux: hlsUrl + thumbnailUrl from Mux playback ID
 *   - video uploaded locally (worker pipeline): hlsUrl from S3 public path
 */

import { loadEnv } from '@tiptalk/config';

export interface MediaForClient {
  id: string;
  kind: string;
  status: string;
  mimeType: string;
  durationMs: number | null;
  bytes: number;
  publicUrl: string | null;
  hlsUrl: string | null;
  thumbnailUrl: string | null;
  createdAt: Date;
}

interface MediaRecord {
  id: string;
  kind: string;
  status: string;
  mimeType: string;
  durationMs: number | null;
  bytes: number;
  originalKey: string;
  hlsManifestKey: string | null;
  thumbnailKey: string | null;
  createdAt: Date;
}

export function formatMediaForClient(m: MediaRecord): MediaForClient {
  const env = loadEnv();
  const supaBase = env.SUPABASE_URL?.replace(/\/$/, '');
  const supaBucket = env.SUPABASE_BUCKET;
  const s3Base = env.S3_PUBLIC_URL.replace(/\/$/, '');
  const useSupabase =
    (env.STORAGE_PROVIDER ?? (env.SUPABASE_URL ? 'supabase' : 's3')) === 'supabase';

  const publicUrl = (key: string): string =>
    useSupabase && supaBase
      ? `${supaBase}/storage/v1/object/public/${supaBucket}/${key}`
      : `${s3Base}/${key}`;

  let imageUrl: string | null = null;
  let hlsUrl: string | null = null;
  let thumbnailUrl: string | null = null;

  if (m.kind === 'image') {
    imageUrl = publicUrl(m.originalKey);
    thumbnailUrl = m.thumbnailKey ? publicUrl(m.thumbnailKey) : imageUrl;
  } else if (m.kind === 'video') {
    if (m.hlsManifestKey?.startsWith('mux:')) {
      const playbackId = m.hlsManifestKey.replace(/^mux:/, '');
      hlsUrl = `https://stream.mux.com/${playbackId}.m3u8`;
      thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg?time=1&width=480`;
    } else if (m.hlsManifestKey) {
      hlsUrl = publicUrl(m.hlsManifestKey);
      thumbnailUrl = m.thumbnailKey ? publicUrl(m.thumbnailKey) : null;
    }
  }

  return {
    id: m.id,
    kind: m.kind,
    status: m.status,
    mimeType: m.mimeType,
    durationMs: m.durationMs,
    bytes: m.bytes,
    publicUrl: imageUrl,
    hlsUrl,
    thumbnailUrl,
    createdAt: m.createdAt,
  };
}
