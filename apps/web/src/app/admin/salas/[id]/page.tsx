'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { io, type Socket } from 'socket.io-client';
import {
  ArrowLeft,
  Eye,
  RefreshCw,
  Radio,
  X as XIcon,
  Copy,
  Check,
  Crown,
} from 'lucide-react';
import { api, ApiError, REALTIME_BASE } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useT } from '@/i18n/useLocale';
import { ChatMessageItem } from '@/components/ChatMessageItem';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import type { ChatMessage } from '@/components/types';

// ---------------------------------------------------------------------------
// Types (local — mirrors GET /admin/rooms/:id and /admin/rooms/:id/messages)
// ---------------------------------------------------------------------------

interface RoomCreator {
  kind: 'user' | 'guest';
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

interface RoomMeta {
  id: string;
  slug: string;
  name: string;
  createdAt: string;
  closedAt: string | null;
  expiresAt: string | null;
  creator: RoomCreator | null;
  membersCount: number;
  messagesCount: number;
  liveCount: number;
}

interface RoomMember {
  id: string;
  role: string;
  status: string;
  joinedAt: string;
  kind: 'user' | 'guest';
  userId: string | null;
  displayName: string;
  avatarUrl: string | null;
  online: boolean;
}

interface RoomDetail {
  room: RoomMeta;
  members: RoomMember[];
}

interface MessagesPage {
  messages: ChatMessage[];
  nextCursor: string | null;
}

// ---------------------------------------------------------------------------

export default function AdminRoomViewerPage() {
  const t = useT();
  const params = useParams<{ id: string }>();
  const token = useAuth((s) => s.token);

  const [detail, setDetail] = useState<RoomDetail | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [observing, setObserving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    if (!token || !params.id) return;
    setError(null);
    try {
      const [d, m] = await Promise.all([
        api<RoomDetail>(`/admin/rooms/${params.id}`, { token }),
        api<MessagesPage>(`/admin/rooms/${params.id}/messages?limit=200`, { token }),
      ]);
      setDetail(d);
      setMessages(m.messages);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) setError(t('adm.roomView.notFound'));
      else setError(err instanceof Error ? err.message : t('adm.roomView.loadError'));
    } finally {
      setLoading(false);
    }
  }, [token, params.id, t]);

  useEffect(() => {
    void load();
  }, [load]);

  // Live feed as an invisible observer: the realtime server only accepts
  // admin:observe from an admin JWT and never announces us to the members.
  useEffect(() => {
    if (!token || !params.id || !detail || detail.room.closedAt) return;
    const socket = io(REALTIME_BASE, { auth: { token }, transports: ['websocket'] });
    socketRef.current = socket;
    const roomId = params.id;

    socket.on('connect', () => {
      socket.emit('admin:observe', { roomId }, (ok: boolean) => setObserving(ok));
    });
    socket.on('disconnect', () => setObserving(false));
    socket.on('message:new', (m: ChatMessage) => {
      if (m.roomId !== roomId) return;
      setMessages((prev) => (prev.some((p) => p.id === m.id) ? prev : [...prev, m]));
    });
    // Members joining/leaving → refresh the roster (cheap, admin-only call).
    socket.on('presence:update', () => {
      void api<RoomDetail>(`/admin/rooms/${roomId}`, { token })
        .then(setDetail)
        .catch(() => undefined);
    });

    return () => {
      socket.emit('admin:unobserve', { roomId });
      socket.disconnect();
      socketRef.current = null;
      setObserving(false);
    };
  }, [token, params.id, detail?.room.id, detail?.room.closedAt]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  async function confirmClose(): Promise<void> {
    if (!token || !detail) return;
    setClosing(true);
    try {
      await api(`/admin/rooms/${detail.room.id}/close`, { method: 'POST', token, body: '{}' });
      setCloseOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adm.roomView.closeError'));
    } finally {
      setClosing(false);
    }
  }

  const publicUrl =
    typeof window !== 'undefined' && detail ? `${window.location.origin}/r/${detail.room.slug}` : '';

  // ------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-5 w-40 animate-pulse rounded bg-surface-container" />
        <div className="h-28 animate-pulse rounded-xl bg-surface-container" />
        <div className="h-96 animate-pulse rounded-xl bg-surface-container" />
      </div>
    );
  }

  if (error && !detail) {
    return (
      <div className="space-y-4">
        <Link href="/admin/salas" className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> {t('adm.rooms.back')}
        </Link>
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!detail) return null;
  const { room, members } = detail;
  const isOpen = !room.closedAt;

  return (
    <div className="space-y-5">
      <Link href="/admin/salas" className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> {t('adm.rooms.back')}
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-surface-container bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate font-display text-2xl font-extrabold tracking-tight">{room.name}</h1>
              {isOpen ? (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">{t('adm.common.roomOpen')}</span>
              ) : (
                <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-semibold text-zinc-700">{t('adm.common.roomClosed')}</span>
              )}
              {isOpen && room.liveCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {t('adm.rooms.liveCount', { n: room.liveCount })}
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
              <span className="font-mono text-xs">/r/{room.slug}</span>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(publicUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary-500 hover:underline"
                title={t('adm.roomView.copyTitle')}
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? t('adm.roomView.copied') : t('adm.roomView.copyLink')}
              </button>
              <span>·</span>
              <span>{t('adm.rooms.createdShort', { date: new Date(room.createdAt).toLocaleString('es-ES') })}</span>
              {room.closedAt && (
                <>
                  <span>·</span>
                  <span>{t('adm.rooms.closedShort', { date: new Date(room.closedAt).toLocaleString('es-ES') })}</span>
                </>
              )}
              <span>·</span>
              <span>{t('adm.rooms.messagesCount', { n: room.messagesCount })}</span>
            </div>
            {room.creator && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="text-ink-muted">{t('adm.roomView.creator')}</span>
                {room.creator.kind === 'user' ? (
                  <Link href={`/admin/usuarios/${room.creator.id}`} className="font-semibold text-ink hover:text-primary-500">
                    {room.creator.displayName}
                  </Link>
                ) : (
                  <span className="font-semibold text-ink">
                    {room.creator.displayName} <span className="text-xs font-normal text-ink-muted">{t('adm.roomView.guestParen')}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                observing
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-surface-container bg-surface-soft text-ink-muted'
              }`}
              title={t('adm.roomView.observerNote')}
            >
              {observing ? <Radio className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {observing ? t('adm.roomView.liveInvisible') : isOpen ? t('adm.roomView.readOnly') : t('adm.roomView.historic')}
            </span>
            <button
              type="button"
              onClick={() => void load()}
              className="grid h-9 w-9 place-items-center rounded-md border border-surface-container bg-white text-ink-muted transition hover:text-ink"
              title={t('adm.common.refresh')}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            {isOpen && (
              <button
                type="button"
                onClick={() => setCloseOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                <XIcon className="h-4 w-4" /> {t('adm.rooms.close')}
              </button>
            )}
          </div>
        </div>
        {error && (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
      </div>

      {/* Body: messages + members */}
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <section className="flex min-h-[480px] flex-col overflow-hidden rounded-xl border border-surface-container bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-surface-container px-4 py-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted">{t('adm.roomView.conversation')}</h2>
            <span className="text-xs text-ink-muted">{t('adm.roomView.messagesLoaded', { n: messages.length })}</span>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto bg-canvas px-2 py-3" style={{ maxHeight: '70vh' }}>
            {messages.length === 0 ? (
              <p className="px-3 py-10 text-center text-sm text-ink-muted">{t('adm.roomView.noMessages')}</p>
            ) : (
              messages.map((m) => (
                <ChatMessageItem key={m.id} msg={m} onTip={() => undefined} canTip={false} />
              ))
            )}
          </div>
          <div className="border-t border-surface-container bg-surface-soft px-4 py-2 text-xs text-ink-muted">
            {t('adm.roomView.footer')}
          </div>
        </section>

        <aside className="space-y-3">
          <div className="rounded-xl border border-surface-container bg-white p-4 shadow-soft">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-muted">
              {t('adm.roomView.members', { n: members.length })}
            </h2>
            {members.length === 0 ? (
              <p className="text-sm text-ink-muted">{t('adm.roomView.noMembers')}</p>
            ) : (
              <ul className="space-y-1.5">
                {members.map((m) => (
                  <li key={m.id} className="flex items-center gap-2 rounded-md px-1 py-1">
                    <MemberAvatar member={m} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {m.kind === 'user' && m.userId ? (
                          <Link href={`/admin/usuarios/${m.userId}`} className="truncate text-sm font-medium text-ink hover:text-primary-500">
                            {m.displayName}
                          </Link>
                        ) : (
                          <span className="truncate text-sm font-medium text-ink">{m.displayName}</span>
                        )}
                        {m.role === 'creator' && <Crown className="h-3 w-3 shrink-0 text-amber-500" />}
                      </div>
                      <p className="text-[11px] text-ink-muted">
                        {m.kind === 'guest' ? t('adm.roomView.guestPrefix') : ''}
                        {m.online ? (
                          <span className="text-emerald-600">{t('adm.roomView.connected')}</span>
                        ) : m.kind === 'user' ? (
                          t('adm.roomView.disconnected')
                        ) : (
                          t('adm.roomView.untrackable')
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={closeOpen}
        title={t('adm.roomView.closeTitle')}
        description={t('adm.roomView.closeDesc', { name: room.name, slug: room.slug })}
        confirmLabel={t('adm.roomView.closeConfirm')}
        tone="danger"
        busy={closing}
        onConfirm={() => void confirmClose()}
        onCancel={() => setCloseOpen(false)}
      />
    </div>
  );
}

function MemberAvatar({ member }: { member: RoomMember }) {
  const initial = member.displayName[0]?.toUpperCase() ?? '?';
  return (
    <span className="relative shrink-0">
      {member.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={member.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
      ) : (
        <span
          className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-white ${
            member.kind === 'guest' ? 'bg-zinc-500' : 'bg-primary-500'
          }`}
        >
          {initial}
        </span>
      )}
      <span
        className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
          member.online ? 'bg-emerald-500' : 'bg-zinc-300'
        }`}
      />
    </span>
  );
}
