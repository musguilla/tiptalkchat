'use client';
import { useRef, useState } from 'react';
import { Paperclip, Loader2 } from 'lucide-react';
import { uploadImage, uploadVideo } from '@/lib/upload';
import { useT } from '@/i18n/useLocale';

interface Props {
  token: string;
  onUploaded: (kind: 'image' | 'video', mediaId: string, extra?: { publicUrl?: string }) => void;
  onError?: (msg: string) => void;
}

const ACCEPT =
  'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime';

export function AttachButton({ token, onUploaded, onError }: Props) {
  const t = useT();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState<'image' | 'video' | null>(null);
  const [progress, setProgress] = useState(0);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0];
    if (!file) return;
    const kind: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image';
    setBusy(kind);
    setProgress(0);
    try {
      if (kind === 'image') {
        const res = await uploadImage(file, token, setProgress);
        onUploaded('image', res.mediaId, { publicUrl: res.publicUrl });
      } else {
        const res = await uploadVideo(file, token, setProgress);
        onUploaded('video', res.mediaId);
      }
    } catch (err) {
      onError?.(
        err instanceof Error
          ? err.message
          : kind === 'image'
            ? t('cmp.attach.errImage')
            : t('cmp.attach.errVideo'),
      );
    } finally {
      setBusy(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  if (busy) {
    return (
      <span className="flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
        <Loader2 className="h-4 w-4 animate-spin" />
        {busy === 'image' ? t('cmp.attach.uploadingImage') : t('cmp.attach.uploadingVideo')} {progress}%
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="grid h-10 w-10 place-items-center rounded-md text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
        title={t('cmp.attach.title')}
        aria-label={t('cmp.attach.title')}
      >
        <Paperclip className="h-5 w-5" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={handleFile}
      />
    </>
  );
}
