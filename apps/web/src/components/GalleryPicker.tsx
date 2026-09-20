'use client';
import { useEffect, useState } from 'react';
import { ChevronDown, Image as ImageIcon, Loader2, Send, Lock } from 'lucide-react';
import { api } from '@/lib/api';
import { useT } from '@/i18n/useLocale';

interface GalleryPhoto {
  id: string;
  url: string;
  isPublic: boolean;
}

/**
 * Compact gallery picker rendered inside the chat sidebar. Shows the
 * current user's photos as small thumbnails; click one to send it into
 * the current room. Collapses by default to save space.
 */
export function GalleryPicker({
  userId,
  token,
  onSend,
}: {
  userId: string;
  token: string;
  onSend: (url: string) => Promise<void> | void;
}) {
  const t = useT();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    if (!open || loaded) return;
    api<{ photos: GalleryPhoto[] }>(`/users/${userId}/photos`, { token })
      .then((r) => setPhotos(r.photos))
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, [open, loaded, userId, token]);

  async function pick(p: GalleryPhoto): Promise<void> {
    setSending(p.id);
    try {
      await onSend(p.url);
    } finally {
      setSending(null);
    }
  }

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="border-t border-zinc-200 dark:border-zinc-800"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-ink">
        <span className="flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5" />
          {t('cmp.gallery.picker.title')}
        </span>
        <ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" />
      </summary>
      <div className="px-3 pb-3">
        {!loaded ? (
          <div className="grid h-16 place-items-center">
            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
          </div>
        ) : photos.length === 0 ? (
          <p className="px-1 py-3 text-[11px] leading-relaxed text-zinc-500">
            {t('cmp.gallery.picker.empty')}
          </p>
        ) : (
          <ul className="grid grid-cols-3 gap-1.5">
            {photos.map((p) => (
              <li key={p.id} className="relative">
                <button
                  type="button"
                  onClick={() => pick(p)}
                  disabled={sending !== null}
                  className="group relative block aspect-square w-full overflow-hidden rounded-md bg-surface-soft transition hover:ring-2 hover:ring-primary-500 disabled:opacity-50"
                  title={t('cmp.gallery.picker.sendToChat')}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt=""
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                  {!p.isPublic && (
                    <span className="absolute left-0.5 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-black/60 text-white">
                      <Lock className="h-2.5 w-2.5" />
                    </span>
                  )}
                  <span className="absolute inset-0 grid place-items-center bg-ink/60 opacity-0 transition group-hover:opacity-100">
                    {sending === p.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <Send className="h-4 w-4 text-white" />
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  );
}
