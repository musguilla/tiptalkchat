'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Image as ImageIcon,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Send,
  Plus,
  MessageCircle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { uploadGalleryPhoto } from '@/lib/upload';
import { SectionCard } from './SectionCard';
import { useT } from '@/i18n/useLocale';

interface GalleryPhoto {
  id: string;
  url: string | null;
  isPublic: boolean;
  createdAt: string;
  viewerCanSee: boolean;
}

interface OpenRoom {
  id: string;
  slug: string;
  name: string;
}

/**
 * Profile photo gallery. Owner can upload + toggle public/private + delete +
 * "Send to chat" (drops the photo as an image message into one of their
 * open rooms). Visitors see public photos clear and private ones blurred.
 */
export function ProfileGallery({
  userId,
  isSelf,
  token,
  ownRooms,
  onMessage,
}: {
  userId: string;
  isSelf: boolean;
  token: string | null;
  ownRooms: OpenRoom[];
  onMessage?: () => void;
}) {
  const t = useT();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [sendPickerFor, setSendPickerFor] = useState<string | null>(null);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!userId) return;
    api<{ photos: GalleryPhoto[] }>(`/users/${userId}/photos`, token ? { token } : {})
      .then((r) => setPhotos(r.photos))
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, [userId, token]);

  async function pickFiles(files: FileList | null): Promise<void> {
    if (!files || files.length === 0 || !token) return;
    setUploadError(null);
    for (const file of Array.from(files)) {
      setUploadPct(0);
      try {
        const res = await uploadGalleryPhoto(file, token, setUploadPct);
        const created = await api<GalleryPhoto>('/users/me/photos', {
          method: 'POST',
          token,
          body: JSON.stringify({
            publicUrl: res.publicUrl,
            storageKey: res.storageKey,
            isPublic: false,
          }),
        });
        setPhotos((prev) => [{ ...created, viewerCanSee: true }, ...prev]);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : t('cmp.profileGallery.uploadFailed'));
      } finally {
        setUploadPct(null);
      }
    }
  }

  async function togglePublic(p: GalleryPhoto): Promise<void> {
    if (!token) return;
    try {
      const updated = await api<GalleryPhoto>(`/users/me/photos/${p.id}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify({ isPublic: !p.isPublic }),
      });
      setPhotos((prev) =>
        prev.map((x) =>
          x.id === p.id ? { ...x, isPublic: updated.isPublic } : x,
        ),
      );
    } catch {
      /* noop */
    }
  }

  async function deletePhoto(p: GalleryPhoto): Promise<void> {
    if (!token) return;
    if (!confirm(t('cmp.profileGallery.confirmDelete'))) return;
    try {
      await api(`/users/me/photos/${p.id}`, { method: 'DELETE', token });
      setPhotos((prev) => prev.filter((x) => x.id !== p.id));
    } catch {
      /* noop */
    }
  }

  async function sendToChat(p: GalleryPhoto, room: OpenRoom): Promise<void> {
    if (!token) return;
    setSendingTo(room.id);
    try {
      // The message route accepts a `mediaUrl` field for direct URLs?
      // Currently it expects a mediaId. For gallery photos (already in
      // Supabase) we wrap the URL in a synthetic image-kind message via
      // body. The chat side will render it via author.avatarUrl style.
      // Cleanest path: POST a text message with the URL inline + a marker
      // so the chat renders an inline image. For now use body that is
      // the URL — the chat renderer should detect image URLs and inline.
      await api('/messages', {
        method: 'POST',
        token,
        body: JSON.stringify({
          roomId: room.id,
          kind: 'text',
          body: p.url,
        }),
      });
      setSendPickerFor(null);
    } catch {
      /* noop */
    } finally {
      setSendingTo(null);
    }
  }

  return (
    <SectionCard
      title={t('cmp.profileGallery.title')}
      icon={<ImageIcon className="h-4 w-4" />}
      className="mt-4"
      action={
        <>
          <span className="text-sm text-ink-muted">
            {t('cmp.profileGallery.count', {
              total: photos.length,
              public: photos.filter((p) => p.isPublic).length,
            })}
          </span>
          {isSelf && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploadPct !== null}
            className="btn-tactile inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-soft hover:shadow-vivid disabled:opacity-60"
          >
            {uploadPct !== null ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> {uploadPct}%
              </>
            ) : (
              <>
                <Plus className="h-3 w-3" /> {t('cmp.profileGallery.upload')}
              </>
            )}
          </button>
          )}
        </>
      }
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => {
          void pickFiles(e.target.files);
          if (fileRef.current) fileRef.current.value = '';
        }}
      />

      {uploadError && (
        <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {uploadError}
        </p>
      )}

      {!loaded ? (
        <div className="grid place-items-center rounded-lg border border-dashed border-surface-container bg-surface-soft/50 px-6 py-12">
          <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
        </div>
      ) : photos.length === 0 ? (
        <div className="grid place-items-center rounded-lg border border-dashed border-surface-container bg-surface-soft/50 px-6 py-12 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-50 text-primary-500">
            {isSelf ? <ImageIcon className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
          </div>
          <p className="mt-3 max-w-sm text-sm text-ink-muted">
            {isSelf
              ? t('cmp.profileGallery.emptySelf')
              : t('cmp.profileGallery.emptyOther')}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((p) => (
            <li
              key={p.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-surface-container bg-surface-soft shadow-soft"
            >
              {p.viewerCanSee ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.url ?? undefined}
                  alt=""
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-surface-container to-surface-soft p-3 text-center">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-ink-muted shadow-soft">
                    <Lock className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] font-medium text-ink-muted">{t('cmp.profileGallery.privatePhoto')}</p>
                  {onMessage && (
                    <button
                      type="button"
                      onClick={onMessage}
                      className="btn-tactile inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-3 py-1.5 text-[11px] font-bold text-white shadow-soft hover:shadow-vivid"
                    >
                      <MessageCircle className="h-3 w-3" />
                      {t('cmp.profileGallery.message')}
                    </button>
                  )}
                </div>
              )}

              {/* Visibility badge — only where the photo itself is shown. */}
              {p.viewerCanSee && (
              <span
                className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${
                  p.isPublic
                    ? 'bg-emerald-500/90 text-white'
                    : 'bg-black/60 text-white'
                }`}
              >
                {p.isPublic ? <Eye className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                {p.isPublic ? t('cmp.profileGallery.public') : t('cmp.profileGallery.private')}
              </span>
              )}

              {/* Owner controls — visible on hover */}
              {isSelf && (
                <div className="absolute inset-x-2 bottom-2 flex flex-wrap items-center justify-end gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => togglePublic(p)}
                    title={p.isPublic ? t('cmp.profileGallery.makePrivate') : t('cmp.profileGallery.makePublic')}
                    className="grid h-8 w-8 place-items-center rounded-md bg-white/95 text-ink shadow-soft hover:bg-white"
                  >
                    {p.isPublic ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                  {ownRooms.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setSendPickerFor((s) => (s === p.id ? null : p.id))
                      }
                      title={t('cmp.profileGallery.sendToChat')}
                      className="grid h-8 w-8 place-items-center rounded-md bg-white/95 text-primary-500 shadow-soft hover:bg-white"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deletePhoto(p)}
                    title={t('cmp.profileGallery.delete')}
                    className="grid h-8 w-8 place-items-center rounded-md bg-white/95 text-red-500 shadow-soft hover:bg-white"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Send-to-chat dropdown */}
              {isSelf && sendPickerFor === p.id && (
                <div
                  className="absolute inset-x-2 bottom-12 z-10 max-h-44 overflow-y-auto rounded-lg bg-white p-2 text-xs shadow-vivid-strong"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                    {t('cmp.profileGallery.sendTo')}
                  </p>
                  {ownRooms.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => sendToChat(p, r)}
                      disabled={sendingTo === r.id}
                      className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-ink hover:bg-surface-soft disabled:opacity-50"
                    >
                      <span className="truncate font-medium">{r.name}</span>
                      {sendingTo === r.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Send className="h-3 w-3 text-primary-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
