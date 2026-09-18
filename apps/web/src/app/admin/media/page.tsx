'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Eye,
  Film,
  Image as ImageIcon,
  Lock,
  MessagesSquare,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useAdminFetch } from '../_components/useAdminFetch';
import { readPage, useUrlState } from '../_components/useUrlState';
import { PageHeader } from '../_components/PageHeader';
import { Tabs, type TabItem } from '../_components/Tabs';
import { Pagination } from '../_components/Pagination';
import { CardSkeleton, EmptyState, ErrorBanner } from '../_components/Feedback';
import { formatDate } from '../_components/format';

type MediaSource = 'all' | 'chat' | 'avatar' | 'gallery';
type MediaKind = 'all' | 'image' | 'video';

interface MediaOwner {
  id: string | null;
  displayName: string;
  avatarUrl: string | null;
  isGuest: boolean;
}

interface MediaRoom {
  id: string;
  slug: string;
  name: string;
}

interface MediaItem {
  id: string;
  source: 'chat' | 'avatar' | 'gallery';
  kind: 'image' | 'video';
  status: string;
  url: string | null;
  thumbnailUrl: string | null;
  mimeType: string | null;
  bytes: number | null;
  createdAt: string;
  isPublic: boolean | null;
  owner: MediaOwner | null;
  room: MediaRoom | null;
}

interface MediaResponse {
  items: MediaItem[];
  total: number;
  page: number;
  limit: number;
  counts: { chat: number; avatar: number; gallery: number; total: number };
  chatBytes: number;
}

const SOURCE_META: Record<MediaItem['source'], { label: string; icon: typeof ImageIcon }> = {
  chat: { label: 'Chat', icon: MessagesSquare },
  avatar: { label: 'Avatar', icon: UserIcon },
  gallery: { label: 'Galería', icon: ImageIcon },
};

function formatBytes(bytes: number | null): string | null {
  if (bytes === null || bytes <= 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readSource(v: string | null): MediaSource {
  return v === 'chat' || v === 'avatar' || v === 'gallery' ? v : 'all';
}
function readKind(v: string | null): MediaKind {
  return v === 'image' || v === 'video' ? v : 'all';
}

export default function AdminMediaPage() {
  return (
    <Suspense fallback={<CardSkeleton count={8} />}>
      <MediaInner />
    </Suspense>
  );
}

function MediaInner() {
  const { searchParams, set } = useUrlState();
  const source = readSource(searchParams.get('source'));
  const kind = readKind(searchParams.get('kind'));
  const page = readPage(searchParams);
  const limit = 48;

  const query = new URLSearchParams({
    source,
    kind,
    page: String(page),
    limit: String(limit),
  });
  const { data, loading, refreshing, error, reload } = useAdminFetch<MediaResponse>(
    `/admin/media?${query.toString()}`,
  );

  const counts = data?.counts;
  const sourceTabs: ReadonlyArray<TabItem<MediaSource>> = [
    { key: 'all', label: 'Todo', count: counts?.total },
    { key: 'chat', label: 'Chats', count: counts?.chat },
    { key: 'avatar', label: 'Avatares', count: counts?.avatar },
    { key: 'gallery', label: 'Galerías', count: counts?.gallery },
  ];
  const kindTabs: ReadonlyArray<TabItem<MediaKind>> = [
    { key: 'all', label: 'Todo' },
    { key: 'image', label: 'Imágenes' },
    { key: 'video', label: 'Vídeos' },
  ];

  const chatWeight = data ? formatBytes(data.chatBytes) : null;

  return (
    <div>
      <PageHeader
        title="Media"
        subtitle="Todo lo que se ha subido: imágenes y vídeos de los chats, fotos de perfil y galerías."
        refreshing={refreshing}
      >
        <button
          type="button"
          onClick={reload}
          className="btn-tactile rounded-md border border-surface-container bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:bg-surface-soft"
        >
          Actualizar
        </button>
      </PageHeader>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Tabs items={sourceTabs} value={source} onChange={(k) => set({ source: k === 'all' ? null : k, page: null })} />
        <Tabs items={kindTabs} value={kind} onChange={(k) => set({ kind: k === 'all' ? null : k, page: null })} />
        {chatWeight && (
          <span className="text-xs text-ink-muted">
            {chatWeight} en archivos de chat
          </span>
        )}
      </div>

      {error && <ErrorBanner message={error} onRetry={reload} />}

      {loading ? (
        <CardSkeleton count={8} />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="h-6 w-6" />}
          title="Sin archivos"
          hint="Cuando alguien suba una foto a un chat, cambie su avatar o añada fotos a su galería, aparecerán aquí."
        />
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {data.items.map((item) => (
              <MediaCard key={item.id} item={item} onDeleted={reload} />
            ))}
          </ul>
          <div className="mt-5">
            <Pagination
              page={page}
              limit={limit}
              total={data.total}
              disabled={refreshing}
              onPage={(p) => set({ page: p === 1 ? null : String(p) })}
            />
          </div>
        </>
      )}
    </div>
  );
}

function MediaCard({ item, onDeleted }: { item: MediaItem; onDeleted: () => void }) {
  const token = useAuth((s) => s.token);
  const [broken, setBroken] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const meta = SOURCE_META[item.source];
  const SourceIcon = meta.icon;
  const preview = item.thumbnailUrl ?? item.url;
  const weight = formatBytes(item.bytes);
  const processing = item.kind === 'video' && item.status !== 'ready';
  // item.id is "<source>:<rawId>"; the API deletes by source + rawId.
  const rawId = item.id.slice(item.source.length + 1);

  async function confirmDelete(): Promise<void> {
    if (!token) return;
    setDeleting(true);
    try {
      await api(`/admin/media/${item.source}/${rawId}`, { method: 'DELETE', token });
      setConfirming(false);
      onDeleted();
    } catch {
      setDeleting(false);
    }
  }

  return (
    <li className="group overflow-hidden rounded-xl border border-surface-container bg-white shadow-soft transition hover:shadow-vivid">
      <div className="relative aspect-square bg-surface-soft">
        {preview && !broken ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt=""
            loading="lazy"
            onError={() => setBroken(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-ink-soft">
            {item.kind === 'video' ? <Film className="h-7 w-7" /> : <ImageIcon className="h-7 w-7" />}
          </div>
        )}

        <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
          <SourceIcon className="h-3 w-3" />
          {meta.label}
        </span>

        {item.kind === 'video' && (
          <span className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-ink/70 text-white backdrop-blur-sm">
            <Film className="h-3 w-3" />
          </span>
        )}

        {item.isPublic === false && (
          <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            <Lock className="h-2.5 w-2.5" /> Privada
          </span>
        )}

        {processing && (
          <span className="absolute inset-x-1.5 bottom-1.5 rounded bg-amber-500/90 px-2 py-0.5 text-center text-[10px] font-semibold text-white">
            Procesando
          </span>
        )}

        <button
          type="button"
          onClick={() => setConfirming(true)}
          title="Borrar archivo"
          className="absolute right-1.5 top-1.5 z-10 grid h-7 w-7 place-items-center rounded-full bg-red-600/90 text-white opacity-0 shadow transition hover:bg-red-700 group-hover:opacity-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>

        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 grid place-items-center bg-ink/40 opacity-0 transition group-hover:opacity-100"
            title="Abrir original"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink">
              <ExternalLink className="h-3.5 w-3.5" /> Abrir
            </span>
          </a>
        )}
      </div>

      <div className="space-y-1 p-2.5 text-xs">
        {item.owner ? (
          item.owner.id ? (
            <Link
              href={`/admin/usuarios/${item.owner.id}`}
              className="block truncate font-semibold text-ink hover:text-primary-600 hover:underline"
            >
              {item.owner.displayName}
            </Link>
          ) : (
            <p className="truncate font-semibold text-ink">
              {item.owner.displayName}{' '}
              <span className="font-normal text-ink-soft">(invitado)</span>
            </p>
          )
        ) : (
          <p className="truncate text-ink-soft">Sin autor</p>
        )}

        {item.room && (
          <Link
            href={`/admin/salas/${item.room.id}`}
            className="inline-flex max-w-full items-center gap-1 truncate text-ink-muted hover:text-primary-600 hover:underline"
            title={`Ver «${item.room.name}» como observador`}
          >
            <Eye className="h-3 w-3 shrink-0" />
            <span className="truncate">{item.room.name}</span>
          </Link>
        )}

        <p className="flex items-center gap-1.5 text-[11px] text-ink-soft">
          <span>{formatDate(item.createdAt)}</span>
          {weight && (
            <>
              <span>·</span>
              <span>{weight}</span>
            </>
          )}
        </p>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Borrar archivo"
        description={
          item.source === 'avatar'
            ? `Se eliminará el avatar de ${item.owner?.displayName ?? 'este usuario'} y el archivo del almacenamiento. No se puede deshacer.`
            : 'Se eliminará este archivo del almacenamiento y del registro. No se puede deshacer.'
        }
        confirmLabel="Borrar"
        tone="danger"
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => {
          if (!deleting) setConfirming(false);
        }}
      />
    </li>
  );
}
