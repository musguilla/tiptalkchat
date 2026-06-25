'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { io, type Socket } from 'socket.io-client';
import { Send, Coins, Phone, Video, X as XIcon, LogOut } from 'lucide-react';
import { REALTIME_BASE, api } from '@/lib/api';
import { TIP_BUTTONS, eurCentsToTipsys, formatEur, formatTipsysAsEur } from '@/lib/money';
import { useAuth } from '@/lib/auth-store';
import { Sidebar } from '@/components/Sidebar';
import { Logo } from '@/components/Logo';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { AuthOverlay } from '@/components/AuthOverlay';
import { WalletOverlay } from '@/components/WalletOverlay';
import { ProfileOverlay } from '@/components/ProfileOverlay';
import { UserChip } from '@/components/UserChip';
import { ChatMessageItem } from '@/components/ChatMessageItem';
import { AttachButton } from '@/components/AttachButton';
import { CallPanel } from '@/components/CallPanel';
import type { ChatMessage, Identity } from '@/components/types';
import { t } from '@/i18n';

interface RoomData {
  id: string;
  slug: string;
  name: string;
  creator: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    kind: 'user' | 'guest';
  } | null;
  hasPin: boolean;
  members: Array<{ id: string; role: string; user: Identity | null; guest: Identity | null }>;
}

// Host tokens are persisted in localStorage by /create after an anonymous
// room creation so the host doesn't have to retype their nick on every
// visit.
interface HostTokenEntry {
  token: string;
  displayName: string;
}
const HOST_TOKENS_KEY = 'tiptalk-host-tokens';
function readHostToken(slug: string): HostTokenEntry | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(HOST_TOKENS_KEY);
    if (!raw) return null;
    const tokens = JSON.parse(raw) as Record<string, HostTokenEntry>;
    return tokens[slug] ?? null;
  } catch {
    return null;
  }
}

export default function RoomPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { token, user, clear } = useAuth();
  const [room, setRoom] = useState<RoomData | null>(null);
  const [roomGone, setRoomGone] = useState(false);
  const [needsName, setNeedsName] = useState(false);
  const [guestName, setGuestName] = useState('');
  // Guest JWT issued by the API on join. Lives in component state only
  // (ephemeral; refreshed on every page load).
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [hostToken, setHostToken] = useState<HostTokenEntry | null>(null);
  const [pin, setPin] = useState('');
  const [needsPin, setNeedsPin] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [members, setMembers] = useState<Identity[]>([]);
  const [tipAnimations, setTipAnimations] = useState<Array<{ id: string; emoji: string }>>([]);
  const [tipTarget, setTipTarget] = useState<{ kind: 'message' | 'room'; id: string } | null>(null);
  const [tipEurCents, setTipEurCents] = useState<number>(100); // 1€ default
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [topupEmail, setTopupEmail] = useState('');
  const [topupEurCents, setTopupEurCents] = useState(500); // 5€ default
  const [topupBusy, setTopupBusy] = useState(false);
  const [showTopup, setShowTopup] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [closingRoom, setClosingRoom] = useState(false);
  // Auth overlay state: 'login' | 'signup' | 'upgrade' | null
  // 'upgrade' is the host-claim flow (transfers the anonymous room to a new user account).
  const [authOverlay, setAuthOverlay] = useState<'login' | 'signup' | 'upgrade' | null>(null);
  const [walletOpen, setWalletOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<'audio' | 'video' | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const identity: Identity | null = useMemo(() => {
    if (user) return { id: user.id, displayName: user.displayName, avatarUrl: null, isGuest: false };
    if (hostToken)
      return { id: `host:${hostToken.displayName}`, displayName: hostToken.displayName, avatarUrl: null, isGuest: true };
    if (guestName) return { id: `guest:${guestName}`, displayName: guestName, avatarUrl: null, isGuest: true };
    return null;
  }, [user, guestName, hostToken]);

  useEffect(() => {
    const ht = readHostToken(params.slug);
    if (ht) setHostToken(ht);
    api<RoomData>(`/rooms/${params.slug}`)
      .then((r) => {
        setRoom(r);
        if (r.hasPin && !pin) setNeedsPin(true);
        // Anon host already authenticated via stored token → skip nick prompt.
        if (!user && !guestName && !ht) setNeedsName(true);
      })
      .catch(() => {
        setRoom(null);
        setRoomGone(true);
      });
  }, [params.slug, pin, user, guestName]);

  useEffect(() => {
    if (!room || !identity || needsName || needsPin) return;

    let cancelled = false;
    (async () => {
      try {
        let membershipId = '';
        // Anonymous host already has a token from /rooms creation — skip the
        // join step entirely.
        if (!hostToken) {
          const join = await api<{
            membershipId: string;
            asGuest: boolean;
            guestToken?: string;
          }>(`/rooms/${params.slug}/join`, {
            method: 'POST',
            token: token ?? undefined,
            body: JSON.stringify({
              ...(pin ? { pin } : {}),
              ...(!user ? { displayName: guestName } : {}),
            }),
          });
          membershipId = join.membershipId;
          if (join.asGuest && join.guestToken) setGuestToken(join.guestToken);
        }

        const hist = await api<{ messages: ChatMessage[]; nextCursor: string | null }>(
          `/messages?roomId=${room.id}`,
        );
        if (cancelled) return;
        setMessages(hist.messages);

        const socket = io(REALTIME_BASE, {
          auth: token ? { token } : {},
          transports: ['websocket'],
        });
        socketRef.current = socket;

        socket.on('connect', () => {
          socket.emit('room:join', { roomId: room.id, membershipId, identity });
        });
        socket.on('room:state', ({ members }) => setMembers(members));
        socket.on('presence:update', ({ member, online }) => {
          setMembers((prev) => {
            const exists = prev.some((m) => m.id === member.id);
            if (online && !exists) return [...prev, member];
            if (!online) return prev.filter((m) => m.id !== member.id);
            return prev;
          });
        });
        socket.on('message:new', (m) => {
          setMessages((prev) => (prev.some((p) => p.id === m.id) ? prev : [...prev, m]));
        });
        socket.on('tip:new', () => {
          const id = Math.random().toString(36).slice(2);
          const emoji = ['💰', '🪙', '✨'][Math.floor(Math.random() * 3)] ?? '🪙';
          setTipAnimations((prev) => [...prev, { id, emoji }]);
          setTimeout(() => setTipAnimations((prev) => prev.filter((a) => a.id !== id)), 1500);
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    })();

    return () => {
      cancelled = true;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [room, identity, needsName, needsPin, pin, params.slug, token, user, guestName]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  // Poll any in-flight video messages until they're 'ready' (Mux webhook
  // updates the row asynchronously; we refresh just those messages).
  useEffect(() => {
    const processing = messages.filter(
      (m) => m.kind === 'video' && m.media && m.media.status !== 'ready' && m.media.status !== 'failed',
    );
    if (processing.length === 0) return;
    const t = setInterval(async () => {
      for (const msg of processing) {
        if (!msg.media) continue;
        try {
          const updated = await api<{
            id: string;
            status: string;
            hlsUrl: string | null;
            thumbnailUrl: string | null;
          }>(`/media/${msg.media.id}`);
          if (updated.status === 'ready') {
            setMessages((prev) =>
              prev.map((p) =>
                p.id === msg.id && p.media
                  ? {
                      ...p,
                      media: {
                        ...p.media,
                        status: 'ready',
                        hlsUrl: updated.hlsUrl,
                        thumbnailUrl: updated.thumbnailUrl,
                      },
                    }
                  : p,
              ),
            );
          }
        } catch {
          /* ignore — keep polling */
        }
      }
    }, 5000);
    return () => clearInterval(t);
  }, [messages]);

  // The token used for chat actions: user JWT > host JWT (anon creator) >
  // guest JWT (visitor that joined the room).
  const chatAuth = token ?? hostToken?.token ?? guestToken;

  // The viewer is the owner of this room if either:
  //   - they're logged in as the user that originally created it, OR
  //   - they have an anon host-token stored for this slug.
  const isOwner = useMemo(
    () =>
      Boolean(
        (user && room?.creator?.kind === 'user' && room.creator.id === user.id) ||
          (hostToken && room?.creator?.kind === 'guest'),
      ),
    [user, hostToken, room?.creator],
  );


  // Keep wallet balance in sync (used for the tip dialog + the header chip).
  const refreshWallet = useCallback(async () => {
    if (!chatAuth) return;
    try {
      const w = await api<{ balance: number }>('/wallet', { token: chatAuth });
      setWalletBalance(w.balance);
    } catch {
      /* ignore — likely token expired */
    }
  }, [chatAuth]);
  useEffect(() => {
    void refreshWallet();
  }, [refreshWallet]);

  // Optimistic message send: the bubble appears instantly and is replaced
  // with the server's response when it arrives. If it fails, the bubble
  // turns red with a retry link.
  const sendTextMessage = useCallback(
    async (text: string, retryId?: string) => {
      if (!text.trim() || !room || !chatAuth || !identity) return;
      // Stable id — same value drives the optimistic bubble, the immediate
      // socket broadcast, and the eventual API row. That way receivers
      // dedup naturally and we never need to swap an optimistic id for a
      // real one.
      const msgId =
        retryId ??
        (typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `c-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);

      const optimisticMsg: ChatMessage = {
        id: msgId,
        roomId: room.id,
        kind: 'text',
        body: text,
        mediaId: null,
        media: null,
        author: !identity.isGuest ? identity : null,
        guest: identity.isGuest ? identity : null,
        createdAt: new Date().toISOString(),
        clientStatus: 'sending',
      };
      setMessages((prev) => {
        if (retryId) {
          return prev.map((m) =>
            m.id === retryId ? { ...m, clientStatus: 'sending' } : m,
          );
        }
        return [...prev, optimisticMsg];
      });

      // Immediately broadcast over the socket so receivers see the message
      // with sub-100ms latency — we don't wait for the API round-trip. The
      // API write will broadcast again with the same id; receivers dedup.
      // We strip clientStatus so receivers don't see a "sending" badge.
      socketRef.current?.emit(
        'message:send',
        { ...optimisticMsg, clientStatus: undefined },
        () => undefined,
      );

      try {
        const msg = await api<ChatMessage>('/messages', {
          method: 'POST',
          token: chatAuth,
          body: JSON.stringify({ id: msgId, roomId: room.id, kind: 'text', body: text }),
        });
        // Clear the sending badge on the sender's local copy. We don't
        // replace the whole message — same id, same content — just flip
        // clientStatus to undefined so the optimistic bubble settles.
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...msg, clientStatus: undefined } : m)),
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, clientStatus: 'failed' } : m)),
        );
      }
    },
    [room, chatAuth, identity],
  );

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text) return;
    setInput(''); // clear immediately — no perceived latency
    void sendTextMessage(text);
  }, [input, sendTextMessage]);

  const retryMessage = useCallback(
    (msg: ChatMessage) => {
      if (!msg.body) return;
      void sendTextMessage(msg.body, msg.id);
    },
    [sendTextMessage],
  );

  // Start a call AND broadcast an invitation system-message so the other
  // participants see a green-highlighted bubble in the chat with a "Unirse"
  // button.
  const startCall = useCallback(
    (mode: 'audio' | 'video') => {
      setActiveCall(mode);
      if (!room || !chatAuth || !identity) return;
      const inviteBody = JSON.stringify({
        type: 'call_invite',
        mode,
        by: identity.displayName,
      });
      // Fire and forget — best-effort.
      void api<ChatMessage>('/messages', {
        method: 'POST',
        token: chatAuth,
        body: JSON.stringify({ roomId: room.id, kind: 'system', body: inviteBody }),
      })
        .then((msg) => {
          socketRef.current?.emit('message:send', msg, () => undefined);
          setMessages((prev) => (prev.some((p) => p.id === msg.id) ? prev : [...prev, msg]));
        })
        .catch(() => undefined);
    },
    [room, chatAuth, identity],
  );

  const joinCallFromInvite = useCallback((mode: 'audio' | 'video') => {
    setActiveCall(mode);
  }, []);

  const sendMediaMessage = useCallback(
    async (kind: 'image' | 'video', mediaId: string) => {
      if (!room || !chatAuth) return;
      const msg = await api<ChatMessage>('/messages', {
        method: 'POST',
        token: chatAuth,
        body: JSON.stringify({ roomId: room.id, kind, mediaId }),
      });
      socketRef.current?.emit('message:send', msg, () => undefined);
      setMessages((prev) => [...prev, msg]);
    },
    [room, chatAuth],
  );

  const sendTip = useCallback(async () => {
    if (!tipTarget || !room || !chatAuth) return;
    const tipsysAmount = eurCentsToTipsys(tipEurCents);
    try {
      await api('/tips', {
        method: 'POST',
        token: chatAuth,
        body: JSON.stringify({
          amount: tipsysAmount,
          targetType: tipTarget.kind,
          targetId: tipTarget.id,
          roomId: room.id,
        }),
      });
      setTipTarget(null);
      void refreshWallet();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'error';
      if (msg.includes('402')) {
        setShowTopup(true);
      } else if (msg.includes('400')) {
        // Most likely the room creator is anonymous and can't receive yet.
        setTipTarget(null);
        setUploadError(
          'Este anfitrión aún no ha activado los pagos. Pídele que pulse "Activar pagos" en la sala.',
        );
      } else {
        setTipTarget(null);
        setUploadError('No se pudo enviar la propina: ' + msg);
      }
    }
  }, [tipEurCents, tipTarget, room, chatAuth, refreshWallet]);

  const confirmCloseRoom = useCallback(async () => {
    if (!room || !chatAuth) return;
    setClosingRoom(true);
    try {
      await api(`/rooms/${room.id}/close`, { method: 'POST', token: chatAuth, body: '{}' });
      // Clean up host token from localStorage after closing.
      if (hostToken && typeof window !== 'undefined') {
        try {
          const raw = window.localStorage.getItem(HOST_TOKENS_KEY);
          if (raw) {
            const tokens = JSON.parse(raw) as Record<string, HostTokenEntry>;
            delete tokens[params.slug];
            window.localStorage.setItem(HOST_TOKENS_KEY, JSON.stringify(tokens));
          }
        } catch {
          /* ignore */
        }
      }
      router.push('/');
    } catch (err) {
      setClosingRoom(false);
      setShowCloseConfirm(false);
      setUploadError(
        'No se pudo cerrar la sala: ' + (err instanceof Error ? err.message : 'error'),
      );
    }
  }, [room, chatAuth, router, hostToken, params.slug]);

  const startGuestTopup = useCallback(async () => {
    if (!room || !topupEmail || !guestToken) return;
    setTopupBusy(true);
    try {
      const res = await api<{ url: string }>('/tips/guest-topup', {
        method: 'POST',
        token: guestToken,
        body: JSON.stringify({
          eurCents: topupEurCents,
          roomId: room.id,
          email: topupEmail,
        }),
      });
      window.location.href = res.url;
    } catch (err) {
      alert('No se pudo iniciar el pago: ' + (err instanceof Error ? err.message : 'error'));
      setTopupBusy(false);
    }
  }, [room, topupEmail, topupEurCents, guestToken]);

  // Show "tip sent" toast after returning from Stripe Checkout.
  const [tipToast, setTipToast] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const tip = url.searchParams.get('tip');
    const topup = url.searchParams.get('topup');
    if (tip === 'success' || topup === 'success') {
      setTipToast(topup ? '✅ ¡Saldo recargado! Ya puedes enviar propinas.' : '✅ ¡Propina enviada!');
      url.searchParams.delete('tip');
      url.searchParams.delete('topup');
      url.searchParams.delete('session');
      window.history.replaceState({}, '', url.toString());
      const t = setTimeout(() => setTipToast(null), 4000);
      void refreshWallet();
      return () => clearTimeout(t);
    }
    if (tip === 'cancelled' || topup === 'cancelled') {
      setTipToast('Pago cancelado.');
      url.searchParams.delete('tip');
      url.searchParams.delete('topup');
      window.history.replaceState({}, '', url.toString());
      const t = setTimeout(() => setTipToast(null), 3000);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (roomGone) {
    return <RoomGoneScreen onDone={() => router.push('/')} />;
  }

  if (!room) {
    return (
      <main className="grid min-h-screen place-items-center">
        <div className="text-zinc-500">Cargando sala…</div>
      </main>
    );
  }

  if (needsName || needsPin) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-50 p-6 dark:bg-zinc-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setNeedsName(false);
            setNeedsPin(false);
          }}
          className="w-full max-w-sm space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <h1 className="text-xl font-bold">Unirse a {room.name}</h1>
          {needsName && (
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Tu nombre</span>
              <input required value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800" />
            </label>
          )}
          {needsPin && (
            <label className="block space-y-1 text-sm">
              <span className="font-medium">PIN</span>
              <input type="password" required value={pin} onChange={(e) => setPin(e.target.value)} className="w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800" />
            </label>
          )}
          <button className="w-full rounded-md bg-primary-500 px-4 py-2 font-semibold text-white">Entrar</button>
        </form>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col">
      <header className="flex items-center justify-between gap-2 border-b border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="flex shrink-0 items-center">
            <Logo className="text-lg" />
          </Link>
          <span className="hidden truncate text-sm font-semibold md:inline">/r/{room.slug}</span>
          <span className="hidden truncate text-sm text-zinc-500 lg:inline">— {room.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {chatAuth && (
            <>
              <button
                onClick={() => startCall('audio')}
                className="grid h-9 w-9 place-items-center rounded-md bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100"
                title="Llamada de voz"
              >
                <Phone className="h-4 w-4" />
              </button>
              <button
                onClick={() => startCall('video')}
                className="grid h-9 w-9 place-items-center rounded-md bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100"
                title="Videollamada"
              >
                <Video className="h-4 w-4" />
              </button>
            </>
          )}
          {/* Anonymous host: prominent CTA to claim payouts */}
          {hostToken && !user && room.creator?.kind === 'guest' && (
            <button
              onClick={() => setAuthOverlay('upgrade')}
              className="btn-tactile whitespace-nowrap rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-3 py-1.5 text-xs font-semibold text-white shadow-soft hover:shadow-vivid"
              title="Activar propinas para esta sala"
            >
              <span className="sm:hidden">Cobrar</span>
              <span className="hidden sm:inline">Activar propinas en el chat</span>
            </button>
          )}
          {/* Visitor: prominent CTA to tip the host */}
          {!isOwner && chatAuth && (
            <button
              onClick={() => setTipTarget({ kind: 'room', id: room.id })}
              className="btn-tactile whitespace-nowrap rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-3 py-1.5 text-xs font-semibold text-white shadow-soft hover:shadow-vivid"
              title="Enviar propinas al anfitrión"
            >
              <span className="sm:hidden">Tipear</span>
              <span className="hidden sm:inline">Dale propinas a tu compi de chat!</span>
            </button>
          )}
          {token && (
            <button
              type="button"
              onClick={() => setWalletOpen(true)}
              className="rounded-md bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100"
            >
              Monedero
            </button>
          )}
          {isOwner && (
            <button
              onClick={() => setShowCloseConfirm(true)}
              className="flex items-center gap-1 rounded-md bg-red-100 px-3 py-1 text-sm font-semibold text-red-900 hover:bg-red-200 dark:bg-red-950 dark:text-red-200"
              title="Cerrar sala"
            >
              <XIcon className="h-3.5 w-3.5" />
              Cerrar sala
            </button>
          )}
          {user && (
            <>
              <UserChip user={user} onClick={() => setProfileOpen(true)} />
              <button
                type="button"
                onClick={() => {
                  clear();
                  router.push('/');
                }}
                className="grid h-9 w-9 place-items-center rounded-md text-ink-muted transition hover:bg-surface-soft hover:text-ink"
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </header>

      <div className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
        <section className="order-2 flex flex-1 flex-col min-h-0 md:order-1">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 py-3">
            {messages.map((m) => (
              <ChatMessageItem
                key={m.id}
                msg={m}
                onTip={(msg) => setTipTarget({ kind: 'message', id: msg.id })}
                onRetry={retryMessage}
                onJoinCall={joinCallFromInvite}
                canTip={!isOwner}
              />
            ))}
          </div>
          {uploadError && (
            <div className="border-t border-red-200 bg-red-50 px-3 py-1 text-xs text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {uploadError}
              <button onClick={() => setUploadError(null)} className="ml-2 underline">cerrar</button>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage();
            }}
            className="flex items-center gap-2 border-t border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900"
          >
            {!isOwner && (
              <button
                type="button"
                onClick={() => setTipTarget({ kind: 'room', id: room.id })}
                className="grid h-10 w-10 place-items-center rounded-md bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100"
                title="Propina al chat"
              >
                <Coins className="h-5 w-5" />
              </button>
            )}
            {chatAuth && (
              <AttachButton
                token={chatAuth}
                onUploaded={(kind, mediaId) => void sendMediaMessage(kind, mediaId)}
                onError={setUploadError}
              />
            )}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('es', 'chat.placeholder')}
              className="flex-1 rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800"
              disabled={!chatAuth}
            />
            <button type="submit" disabled={!chatAuth || !input.trim()} className="grid h-10 w-10 place-items-center rounded-md bg-primary-500 text-white disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>

        {/* Call sidebar — sits between the chat and the users sidebar. */}
        {activeCall && chatAuth && (
          <CallPanel
            roomId={room.id}
            token={chatAuth}
            mode={activeCall}
            onClose={() => setActiveCall(null)}
          />
        )}

        <Sidebar members={members} creator={room.creator} />

        {/* Tip animation overlay */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {tipAnimations.map((a) => (
            <span
              key={a.id}
              className="absolute top-2/3 -translate-x-1/2 animate-tipfly select-none text-4xl"
              style={{ left: `${30 + Math.random() * 40}%` }}
            >
              {a.emoji}
            </span>
          ))}
        </div>

        {/* Tip dialog */}
        {tipTarget && (
          <div className="absolute inset-0 grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-sm space-y-4 rounded-xl bg-white p-5 dark:bg-zinc-900">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-bold">Enviar propina</h3>
                <span className="text-xs text-zinc-500">
                  Saldo: <strong className="text-zinc-900 dark:text-zinc-100">
                    {walletBalance !== null ? formatTipsysAsEur(walletBalance) : '…'}
                  </strong>
                </span>
              </div>

              {!showTopup ? (
                <>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Cantidad
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {TIP_BUTTONS.map((p) => (
                        <button
                          key={p.eurCents}
                          type="button"
                          onClick={() => setTipEurCents(p.eurCents)}
                          className={`rounded-md border p-2 text-sm transition ${
                            tipEurCents === p.eurCents
                              ? 'border-amber-500 bg-amber-50 font-bold text-amber-900 dark:bg-amber-900/40 dark:text-amber-100'
                              : 'border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800'
                          }`}
                        >
                          <div className="text-base font-bold">{formatEur(p.eurCents)}</div>
                          <div className="text-[10px] text-zinc-500">{p.tipsys} Tipsys</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {walletBalance !== null && walletBalance < eurCentsToTipsys(tipEurCents) ? (
                    <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-900/30 dark:text-amber-100">
                      Saldo insuficiente para esta propina.{' '}
                      <button onClick={() => setShowTopup(true)} className="font-bold underline">
                        Recargar saldo
                      </button>
                    </div>
                  ) : null}

                  <div className="flex justify-end gap-2">
                    <button onClick={() => setTipTarget(null)} className="rounded-md px-3 py-2 text-sm">
                      Cancelar
                    </button>
                    <button
                      onClick={sendTip}
                      disabled={walletBalance === null || walletBalance < eurCentsToTipsys(tipEurCents)}
                      className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      Enviar {formatEur(tipEurCents)}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Pagas con tarjeta vía Stripe. El saldo queda en tu sesión (12h).
                  </p>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Importe a recargar
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {TIP_BUTTONS.map((p) => (
                        <button
                          key={p.eurCents}
                          type="button"
                          onClick={() => setTopupEurCents(p.eurCents)}
                          className={`rounded-md border p-2 text-sm transition ${
                            topupEurCents === p.eurCents
                              ? 'border-amber-500 bg-amber-50 font-bold text-amber-900 dark:bg-amber-900/40 dark:text-amber-100'
                              : 'border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800'
                          }`}
                        >
                          <div className="text-base font-bold">{formatEur(p.eurCents)}</div>
                          <div className="text-[10px] text-zinc-500">{p.tipsys} Tipsys</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="block space-y-1 text-sm">
                    <span className="font-medium">Tu email (para el recibo)</span>
                    <input
                      type="email"
                      required
                      value={topupEmail}
                      onChange={(e) => setTopupEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                  </label>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setShowTopup(false)} className="rounded-md px-3 py-2 text-sm">
                      Volver
                    </button>
                    <button
                      onClick={startGuestTopup}
                      disabled={topupBusy || !topupEmail || !guestToken}
                      className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {topupBusy ? 'Redirigiendo…' : `Pagar ${formatEur(topupEurCents)}`}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Tip success / cancel toast */}
        {tipToast && (
          <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
            {tipToast}
          </div>
        )}

      </div>

      <ConfirmDialog
        open={showCloseConfirm}
        title="¿Cerrar esta sala?"
        description="Se cerrará para todos los participantes y se eliminarán los mensajes, fotos y vídeos del chat. Esta acción no se puede deshacer."
        confirmLabel="Cerrar sala"
        cancelLabel="Cancelar"
        tone="danger"
        busy={closingRoom}
        onConfirm={confirmCloseRoom}
        onCancel={() => setShowCloseConfirm(false)}
      />

      <AuthOverlay
        open={authOverlay !== null}
        initialMode={authOverlay === 'login' ? 'login' : 'signup'}
        upgradeFromGuestToken={authOverlay === 'upgrade' ? hostToken?.token ?? null : null}
        onClose={() => setAuthOverlay(null)}
        onSuccess={() => {
          // If we just upgraded an anon host, clear the host token (the user
          // is now the canonical owner).
          if (authOverlay === 'upgrade' && hostToken && typeof window !== 'undefined') {
            try {
              const raw = window.localStorage.getItem(HOST_TOKENS_KEY);
              if (raw) {
                const tokens = JSON.parse(raw) as Record<string, HostTokenEntry>;
                delete tokens[params.slug];
                window.localStorage.setItem(HOST_TOKENS_KEY, JSON.stringify(tokens));
              }
            } catch {
              /* ignore */
            }
            setHostToken(null);
          }
          setAuthOverlay(null);
          // Refresh the room so the creator block updates (kind: 'guest' → 'user').
          api<RoomData>(`/rooms/${params.slug}`).then(setRoom).catch(() => undefined);
        }}
      />

      <WalletOverlay open={walletOpen} onClose={() => setWalletOpen(false)} />
      <ProfileOverlay open={profileOpen} onClose={() => setProfileOpen(false)} />
    </main>
  );
}

/**
 * Friendly 'this room is gone' screen. Shows a poofing brand bubble and
 * auto-redirects to home after the countdown. The user can click 'Volver
 * ya' to short-circuit.
 */
function RoomGoneScreen({ onDone }: { onDone: () => void }) {
  const [seconds, setSeconds] = useState(5);
  useEffect(() => {
    if (seconds <= 0) {
      onDone();
      return;
    }
    const id = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [seconds, onDone]);

  return (
    <main className="grid min-h-screen place-items-center overflow-hidden bg-canvas px-6 text-center">
      <div className="relative flex max-w-md flex-col items-center">
        {/* Poof aura — three concentric ping rings + a gradient orb */}
        <div className="relative mb-8 h-40 w-40">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary-500/20 [animation-duration:2.4s]" />
          <span className="absolute inset-4 animate-ping rounded-full bg-secondary-500/30 [animation-duration:1.8s]" />
          <span className="absolute inset-8 animate-ping rounded-full bg-primary-500/40 [animation-duration:1.4s]" />
          <span className="absolute inset-12 grid place-items-center rounded-full bg-gradient-to-br from-secondary-500 to-primary-500 shadow-vivid-strong">
            <span className="font-display text-4xl font-extrabold text-white">✨</span>
          </span>
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          ¡Puf! Esta sala ya no existe
        </h1>
        <p className="mt-3 text-base text-ink-muted">
          Se ha cerrado o ha caducado. Te llevamos al inicio en{' '}
          <span className="font-semibold text-primary-500">{seconds}s</span>.
        </p>

        {/* Bouncing dot row for vibe */}
        <div className="mt-6 flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary-500 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-secondary-500 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary-500" />
        </div>

        <button
          type="button"
          onClick={onDone}
          className="btn-tactile mt-8 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-6 py-3 text-sm font-bold text-white shadow-vivid hover:shadow-vivid-strong"
        >
          Volver ya
        </button>
      </div>
    </main>
  );
}
