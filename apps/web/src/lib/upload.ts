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

// =============================================================================
// Client-side image optimisation
// =============================================================================
//
// Every image upload on the platform passes through optimizeImage() first.
// This saves bandwidth, Supabase Storage costs, and page-load weight for
// viewers.
//
// What we do:
//   - createImageBitmap → canvas → toBlob({ type: 'image/webp' })
//   - Downscale so neither side exceeds the target dimensions (keep aspect)
//   - Re-encode at the requested quality (default 0.85 — visually lossless
//     for photographs at typical web sizes)
//
// What we DON'T do:
//   - Touch animated GIFs (we'd lose the animation; just pass through)
//   - Touch files that are already smaller than the target and < 200KB —
//     re-encoding small images often makes them BIGGER because of webp
//     overhead.
//
// Failures fall back to the original file with a console.warn — uploading
// is more important than optimising.

interface OptimizeOpts {
  /** Max width in pixels. The smaller side may end up smaller. */
  maxWidth: number;
  /** Max height in pixels. */
  maxHeight: number;
  /** 0-1 webp quality. Default 0.85. */
  quality?: number;
}

async function optimizeImage(file: File, opts: OptimizeOpts): Promise<File> {
  // Skip non-images entirely.
  if (!file.type.startsWith('image/')) return file;
  // Skip GIFs — we'd lose the animation.
  if (file.type === 'image/gif') return file;
  // Skip already-tiny files.
  if (file.size < 200 * 1024) return file;
  if (typeof document === 'undefined' || typeof createImageBitmap === 'undefined') {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = scaleToFit(
      bitmap.width,
      bitmap.height,
      opts.maxWidth,
      opts.maxHeight,
    );
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', opts.quality ?? 0.85),
    );
    if (!blob) return file;
    // Refuse the optimisation if it ended up larger than the original
    // (small artwork, line drawings, screenshots).
    if (blob.size >= file.size) return file;

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
    return new File([blob], `${baseName}.webp`, {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[upload] optimize failed — sending original', err);
    return file;
  }
}

function scaleToFit(w: number, h: number, maxW: number, maxH: number): { width: number; height: number } {
  const ratio = Math.min(maxW / w, maxH / h, 1);
  return { width: Math.round(w * ratio), height: Math.round(h * ratio) };
}

// =============================================================================
// Upload helpers
// =============================================================================

/**
 * Three-step image upload for chat media:
 *   1. POST /media/image/upload  → presigned URL
 *   2. PUT the file bytes to that URL (direct to Supabase Storage / S3)
 *   3. POST /media/image/complete → mark MediaAsset as ready
 *
 * Returns the mediaId you can attach to a chat message via
 * `POST /messages { kind: 'image', mediaId }`.
 *
 * Images are downscaled to 1920px max + WebP-compressed before upload.
 */
export async function uploadImage(
  file: File,
  token: string,
  onProgress?: (pct: number) => void,
): Promise<{ mediaId: string; publicUrl: string }> {
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
    throw new Error('Formato no soportado (jpeg, png, webp, gif)');
  }
  const optimised = await optimizeImage(file, { maxWidth: 1920, maxHeight: 1920 });
  const ticket = await api<ImageUploadResponse>('/media/image/upload', {
    method: 'POST',
    token,
    body: JSON.stringify({ contentType: optimised.type, bytes: optimised.size }),
  });

  await uploadBytes(ticket.upload, optimised, onProgress);

  await api('/media/image/complete', {
    method: 'POST',
    token,
    body: JSON.stringify({ mediaId: ticket.mediaId }),
  });

  return { mediaId: ticket.mediaId, publicUrl: ticket.publicUrl };
}

/**
 * Gallery-photo upload to the profile galería. Downscaled to 1920px max,
 * WebP-compressed before upload. Returns the URL + storage key so the caller
 * can register the photo with POST /users/me/photos.
 */
export async function uploadGalleryPhoto(
  file: File,
  token: string,
  onProgress?: (pct: number) => void,
): Promise<{ publicUrl: string; storageKey: string }> {
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
    throw new Error('Formato no soportado (jpeg, png, webp, gif)');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('La foto no puede pesar más de 10 MB');
  }
  const optimised = await optimizeImage(file, { maxWidth: 1920, maxHeight: 1920 });
  const ticket = await api<{
    upload: UploadTicket;
    publicUrl: string;
    storageKey: string;
  }>('/users/me/photos/upload', {
    method: 'POST',
    token,
    body: JSON.stringify({ contentType: optimised.type, bytes: optimised.size }),
  });
  await uploadBytes(ticket.upload, optimised, onProgress);
  return { publicUrl: ticket.publicUrl, storageKey: ticket.storageKey };
}

/**
 * Age-verification document / selfie upload → PRIVATE bucket. Images are lightly
 * optimised (kept legible); PDFs are sent as-is. Returns the storageKey to pass
 * to POST /verification/submit.
 */
export async function uploadVerificationFile(
  file: File,
  kind: 'document' | 'selfie',
  token: string,
  onProgress?: (pct: number) => void,
): Promise<{ storageKey: string }> {
  const isPdf = file.type === 'application/pdf';
  if (!isPdf && !/^image\/(jpeg|png|webp)$/.test(file.type)) {
    throw new Error('Formato no soportado (jpeg, png, webp o pdf)');
  }
  if (file.size > 15 * 1024 * 1024) {
    throw new Error('El archivo no puede pesar más de 15 MB');
  }
  const payload = isPdf
    ? file
    : await optimizeImage(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.9 });
  const ticket = await api<{ upload: UploadTicket; storageKey: string }>(
    '/verification/upload',
    {
      method: 'POST',
      token,
      body: JSON.stringify({ kind, contentType: payload.type, bytes: payload.size }),
    },
  );
  await uploadBytes(ticket.upload, payload, onProgress);
  return { storageKey: ticket.storageKey };
}

/**
 * Profile-avatar upload. Squared down to 512x512 max + WebP-compressed.
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
  const optimised = await optimizeImage(file, { maxWidth: 512, maxHeight: 512, quality: 0.9 });
  const ticket = await api<{ upload: UploadTicket; publicUrl: string }>(
    '/auth/me/avatar/upload',
    {
      method: 'POST',
      token,
      body: JSON.stringify({ contentType: optimised.type, bytes: optimised.size }),
    },
  );
  await uploadBytes(ticket.upload, optimised, onProgress);
  return { publicUrl: ticket.publicUrl };
}

/**
 * Video upload via Mux Direct Upload (or local fallback). Mux processes the
 * file asynchronously; the MediaAsset stays in `uploaded` → `processing` →
 * `ready` driven by Mux's webhook. The UI should show a "Processing..." state
 * until the message's media.status becomes 'ready'.
 *
 * Video is NOT touched client-side — Mux's pipeline already produces
 * adaptive renditions on the server.
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
