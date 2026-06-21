'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { io, type Socket } from 'socket.io-client';
import { Send, Coins, Phone, Video } from 'lucide-react';
import { REALTIME_BASE, api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { Sidebar } from '@/components/Sidebar';
import { ChatMessageItem } from '@/components/ChatMessageItem';
import { AttachButton } from '@/components/AttachButton';
import { CallPanel } from '@/components/CallPanel';
import type { ChatMessage, Identity } from '@/components/types';
import { t } from '@/i18n';

interface RoomData {
  id: string;
  slug: string;
  name: string;
  creator: { id: string; displayName: string; avatarUrl: string | null };
  hasPin: boolean;
  members: Array<{ id: string; role: string; user: Identity | null; guest: Identity | null }>;
}

export default function RoomPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { token, user, clear } = useAuth();
  const [room, setRoom] = useState<RoomData | null>(null);
  const [needsName, setNeedsName] = useState(false);
  const [guestName, setGuestName] = useState('');
  // Guest JWT issued by the API on join. Lives in component state only
  // (ephemeral; refreshed on every page load).
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [needsPin, setNeedsPin] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [members, setMembers] = useState<Identity[]>([]);
  const [tipAnimations, setTipAnimations] = useState<Array<{ id: string; emoji: string }>>([]);
  const [tipTarget, setTipTarget] = useState<{ kind: 'message' | 'room'; id: string } | null>(null);
  const [tipAmount, setTipAmount] = useState(5);
  const [guestTipEur, setGuestTipEur] = useState<number>(500); // 5€ in cents
  const [guestTipEmail, setGuestTipEmail] = useState('');
  const [guestTipBusy, setGuestTipBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<'audio' | 'video' | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const identity: Identity | null = useMemo(() => {
    if (user) return { id: user.id, displayName: user.displayName, avatarUrl: null, isGuest: false };
    if (guestName) return { id: `guest:${guestName}`, displayName: guestName, avatarUrl: null, isGuest: true };
    return null;
  }, [user, guestName]);

  useEffect(() => {
    api<RoomData>(`/rooms/${params.slug}`)
      .then((r) => {
        setRoom(r);
        if (r.hasPin && !pin) setNeedsPin(true);
        if (!user && !guestName) setNeedsName(true);
      })
      .catch(() => setRoom(null));
  }, [params.slug, pin, user, guestName]);

  useEffect(() => {
    if (!room || !identity || needsName || needsPin) return;

    let cancelled = false;
    (async () => {
      try {
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
        if (join.asGuest && join.guestToken) setGuestToken(join.guestToken);

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
          socket.emit('room:join', { roomId: room.id, membershipId: join.membershipId, identity });
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

  // The token used for chat actions: user JWT if logged in, otherwise the
  // guest JWT issued at join time.
  const chatAuth = token ?? guestToken;

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !room || !chatAuth) return;
    const msg = await api<ChatMessage>('/messages', {
      method: 'POST',
      token: chatAuth,
      body: JSON.stringify({ roomId: room.id, kind: 'text', body: input.trim() }),
    });
    socketRef.current?.emit('message:send', msg, () => undefined);
    setMessages((prev) => [...prev, msg]);
    setInput('');
  }, [input, room, chatAuth]);

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
    if (!tipTarget || !room || !token || !tipAmount) return;
    try {
      await api('/tips', {
        method: 'POST',
        token,
        body: JSON.stringify({
          amount: tipAmount,
          targetType: tipTarget.kind,
          targetId: tipTarget.id,
          roomId: room.id,
        }),
      });
      setTipTarget(null);
    } catch {
      alert('No se pudo enviar la propina (¿saldo insuficiente?)');
    }
  }, [tipAmount, tipTarget, room, token]);

  const sendGuestTip = useCallback(async () => {
    if (!tipTarget || !room || !guestTipEmail) return;
    setGuestTipBusy(true);
    try {
      const res = await api<{ url: string }>('/tips/guest-checkout', {
        method: 'POST',
        body: JSON.stringify({
          eurCents: guestTipEur,
          targetType: tipTarget.kind,
          targetId: tipTarget.id,
          roomId: room.id,
          email: guestTipEmail,
        }),
      });
      window.location.href = res.url;
    } catch (err) {
      alert('No se pudo iniciar el pago: ' + (err instanceof Error ? err.message : 'error'));
      setGuestTipBusy(false);
    }
  }, [tipTarget, room, guestTipEur, guestTipEmail]);

  // Show "tip sent" toast after returning from Stripe Checkout.
  const [tipToast, setTipToast] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const tip = url.searchParams.get('tip');
    if (tip === 'success') {
      setTipToast('✅ ¡Propina enviada! Gracias.');
      url.searchParams.delete('tip');
      url.searchParams.delete('session');
      window.history.replaceState({}, '', url.toString());
      const t = setTimeout(() => setTipToast(null), 4000);
      return () => clearTimeout(t);
    }
    if (tip === 'cancelled') {
      setTipToast('Pago cancelado.');
      url.searchParams.delete('tip');
      window.history.replaceState({}, '', url.toString());
      const t = setTimeout(() => setTipToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, []);

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
          <button className="w-full rounded-md bg-brand-600 px-4 py-2 font-semibold text-white">Entrar</button>
        </form>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-bold text-brand-600">TipTalk</Link>
          <span className="text-sm font-semibold">/r/{room.slug}</span>
          <span className="hidden text-sm text-zinc-500 sm:inline">— {room.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {chatAuth && (
            <>
              <button
                onClick={() => setActiveCall('audio')}
                className="grid h-9 w-9 place-items-center rounded-md bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100"
                title="Llamada de voz"
              >
                <Phone className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveCall('video')}
                className="grid h-9 w-9 place-items-center rounded-md bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100"
                title="Videollamada"
              >
                <Video className="h-4 w-4" />
              </button>
            </>
          )}
          <Link href="/wallet" className="rounded-md bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100">
            Monedero
          </Link>
          {token && (
            <button
              onClick={() => {
                clear();
                router.push('/');
              }}
              className="rounded-md px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Salir
            </button>
          )}
        </div>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        <section className="flex flex-1 flex-col">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 py-3">
            {messages.map((m) => (
              <ChatMessageItem
                key={m.id}
                msg={m}
                onTip={(msg) => setTipTarget({ kind: 'message', id: msg.id })}
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
            <button
              type="button"
              onClick={() => setTipTarget({ kind: 'room', id: room.id })}
              className="grid h-10 w-10 place-items-center rounded-md bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100"
              title="Propina al chat"
            >
              <Coins className="h-5 w-5" />
            </button>
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
            <button type="submit" disabled={!chatAuth || !input.trim()} className="grid h-10 w-10 place-items-center rounded-md bg-brand-600 text-white disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
        <Sidebar members={members} />

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
              <h3 className="text-lg font-bold">{t('es', 'tip.send')}</h3>

              {token ? (
                <>
                  <label className="block space-y-1 text-sm">
                    <span className="font-medium">Cantidad (Tipsys)</span>
                    <input
                      type="number"
                      min={1}
                      value={tipAmount}
                      onChange={(e) => setTipAmount(Number(e.target.value))}
                      className="w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                  </label>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setTipTarget(null)} className="rounded-md px-3 py-2 text-sm">
                      Cancelar
                    </button>
                    <button onClick={sendTip} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white">
                      Enviar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Pagas con tarjeta vía Stripe. La propina se acredita al instante.
                  </p>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Importe
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { eur: 100, tipsys: 8 },
                        { eur: 500, tipsys: 40 },
                        { eur: 1000, tipsys: 80 },
                        { eur: 2000, tipsys: 160 },
                      ].map((p) => (
                        <button
                          key={p.eur}
                          type="button"
                          onClick={() => setGuestTipEur(p.eur)}
                          className={`rounded-md border p-2 text-sm transition ${
                            guestTipEur === p.eur
                              ? 'border-amber-500 bg-amber-50 font-bold text-amber-900 dark:bg-amber-900/40 dark:text-amber-100'
                              : 'border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800'
                          }`}
                        >
                          <div className="text-base font-bold">{p.eur / 100} €</div>
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
                      value={guestTipEmail}
                      onChange={(e) => setGuestTipEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                  </label>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setTipTarget(null)} className="rounded-md px-3 py-2 text-sm">
                      Cancelar
                    </button>
                    <button
                      onClick={sendGuestTip}
                      disabled={guestTipBusy || !guestTipEmail}
                      className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {guestTipBusy ? 'Redirigiendo…' : `Pagar ${guestTipEur / 100} €`}
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

        {/* Call panel */}
        {activeCall && chatAuth && (
          <CallPanel
            roomId={room.id}
            token={chatAuth}
            mode={activeCall}
            onClose={() => setActiveCall(null)}
          />
        )}
      </div>
    </main>
  );
}
