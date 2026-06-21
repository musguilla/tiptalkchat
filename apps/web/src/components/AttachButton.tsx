'use client';
import { useRef, useState } from 'react';
import { ImagePlus, Film, Loader2 } from 'lucide-react';
import { uploadImage, uploadVideo } from '@/lib/upload';

interface Props {
  token: string;
  onUploaded: (
    kind: 'image' | 'video',
    mediaId: string,
    extra?: { publicUrl?: string },
  ) => void;
  onError?: (msg: string) => void;
}

export function AttachButton({ token, onUploaded, onError }: Props) {
  const imageRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState<'image' | 'video' | null>(null);
  const [progress, setProgress] = useState(0);

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy('image');
    setProgress(0);
    try {
      const res = await uploadImage(file, token, setProgress);
      onUploaded('image', res.mediaId, { publicUrl: res.publicUrl });
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Error subiendo imagen');
    } finally {
      setBusy(null);
      if (imageRef.current) imageRef.current.value = '';
    }
  }

  async function handleVideo(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy('video');
    setProgress(0);
    try {
      const res = await uploadVideo(file, token, setProgress);
      onUploaded('video', res.mediaId);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Error subiendo vídeo');
    } finally {
      setBusy(null);
      if (videoRef.current) videoRef.current.value = '';
    }
  }

  if (busy) {
    return (
      <span className="flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
        <Loader2 className="h-4 w-4 animate-spin" />
        {busy === 'image' ? 'Subiendo imagen' : 'Subiendo vídeo'} {progress}%
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => imageRef.current?.click()}
        className="grid h-10 w-10 place-items-center rounded-md text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
        title="Subir imagen"
      >
        <ImagePlus className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => videoRef.current?.click()}
        className="grid h-10 w-10 place-items-center rounded-md text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
        title="Subir vídeo"
      >
        <Film className="h-5 w-5" />
      </button>
      <input
        ref={imageRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleImage}
      />
      <input
        ref={videoRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={handleVideo}
      />
    </>
  );
}
