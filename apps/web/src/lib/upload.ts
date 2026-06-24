import { api } from './api';

interface UploadTicket {
  url: string;
  method: 'PUT' | 'POST';
  headers: Record<string, string>;
  expiresInSec: number;
}

interface ImageUploadResponse {
  mediaId: string;
  upload: UploadTicket;
  publicUrl: string;
}

interface VideoUploadResponse {
  mediaId: string;
  provider: 'mux' | 'local';
  upload: UploadTicket;
}

/**
 * Three-step image upload:
 *   1. POST /media/image/upload  → presigned URL
 *   2. PUT the file bytes to that URL (direct to Supabase Storage / S3)
 *   3. POST /media/image/complete → mark MediaAsset as ready
 *
 * Returns the mediaId you can attach to a chat message via
 * `POST /messages { kind: 'image', mediaId }`.
 */
export async function uploadImage(
  file: File,
  token: string,
  onProgress?: (pct: number) => void,
): Promise<{ mediaId: string; publicUrl: string }> {
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
    throw new Error('Formato no soportado (jpeg, png, webp, gif)');
  }
  const ticket = await api<ImageUploadResponse>('/media/image/upload', {
    method: 'POST',
    token,
    body: JSON.stringify({ contentType: file.type, bytes: file.size }),
  });

  await uploadBytes(ticket.upload, file, onProgress);

  await api('/media/image/complete', {
    method: 'POST',
    token,
    body: JSON.stringify({ mediaId: ticket.mediaId }),
  });

  return { mediaId: ticket.mediaId, publicUrl: ticket.publicUrl };
}

/**
 * Profile-avatar upload. Goes through /auth/me/avatar/upload which signs
 * against the public `profiles` Supabase bucket (separate from chat media).
 * After the bytes land, the caller should PATCH /auth/me { avatarUrl }
 * with the returned publicUrl.
 */
export async function uploadAvatar(
  file: File,
  token: string,
  onProgress?: (pct: number) => void,
): Promise<{ publicUrl: string }> {
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
    throw new Error('Formato no soportado (jpeg, png, webp, gif)');
  }
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('La foto no puede pesar más de 2 MB');
  }
  const ticket = await api<{ upload: UploadTicket; publicUrl: string }>(
    '/auth/me/avatar/upload',
    {
      method: 'POST',
      token,
      body: JSON.stringify({ contentType: file.type, bytes: file.size }),
    },
  );
  await uploadBytes(ticket.upload, file, onProgress);
  return { publicUrl: ticket.publicUrl };
}

/**
 * Video upload via Mux Direct Upload (or local fallback). Mux processes the
 * file asynchronously; the MediaAsset stays in `uploaded` → `processing` →
 * `ready` driven by Mux's webhook. The UI should show a "Processing..." state
 * until the message's media.status becomes 'ready'.
 */
export async function uploadVideo(
  file: File,
  token: string,
  onProgress?: (pct: number) => void,
): Promise<{ mediaId: string }> {
  if (!file.type.startsWith('video/')) throw new Error('Solo archivos de vídeo');

  const ticket = await api<VideoUploadResponse>('/media/video/upload', {
    method: 'POST',
    token,
    body: JSON.stringify({ bytes: file.size }),
  });

  await uploadBytes(ticket.upload, file, onProgress);

  return { mediaId: ticket.mediaId };
}

function uploadBytes(
  ticket: UploadTicket,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(ticket.method, ticket.url, true);
    for (const [k, v] of Object.entries(ticket.headers)) xhr.setRequestHeader(k, v);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed: HTTP ${xhr.status} ${xhr.responseText}`));
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(file);
  });
}
