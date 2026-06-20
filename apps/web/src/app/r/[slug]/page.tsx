'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { io, type Socket } from 'socket.io-client';
import { Send, Coins } from 'lucide-react';
import { API_BASE, REALTIME_BASE, api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { Sidebar } from '@/components/Sidebar';
import { ChatMessageItem } from '@/components/ChatMessageItem';
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
  const { token, user, setSession } = useAuth();
  const [room, setRoom] = useState<RoomData | null>(null);
  const [needsName, setNeedsName] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [pin, setPin] = useState('');
  const [needsPin, setNeedsPin] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [members, setMembers] = useState<Identity[]>([]);
  const [tipAnimations, setTipAnimations] = useState<Array<{ id: string; emoji: string }>>([]);
  const [tipTarget, setTipTarget] = useState<{ kind: 'message' | 'room'; id: string } | null>(null);
  const [tipAmount, setTipAmount] = useState(5);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const identity: Identity | null = useMemo(() => {
    if (user) return { id: user.id, displayName: user.displayName, avatarUrl: null, isGuest: false };
    if (guestName) return { id: `guest:${guestName}`, displayName: guestName, avatarUrl: null, isGuest: true };
    return null;
  }, [user, guestName]);

  // Load room
  useEffect(() => {
    api<RoomData>(`/rooms/${params.slug}`)
      .then((r) => {
        setRoom(r);
        if (r.hasPin && !pin) setNeedsPin(true);
        if (!user && !guestName) setNeedsName(true);
      })
      .catch(() => setRoom(null));
  }, [params.slug, pin, user, guestName]);

  // Join + history once we have room + identity
  useEffect(() => {
    if (!room || !identity || needsName || needsPin) return;

    let cancelled = false;
    (async () => {
      try {
        const join = await api<{ membershipId: string; asGuest: boolean }>(`/rooms/${params.slug}/join`, {
          method: 'POST',
          token: token ?? undefined,
          body: JSON.stringify({
            ...(pin ? { pin } : {}),
            ...(!user ? { displayName: guestName } : {}),
          }),
        });

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
        // join failed — likely bad PIN
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

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !room || !token) return;
    const msg = await api<ChatMessage>('/messages', {
      method: 'POST',
      token,
      body: JSON.stringify({ roomId: room.id, kind: 'text', body: input.trim() }),
    });
    socketRef.current?.emit('message:send', msg, () => undefined);
    setMessages((prev) => [...prev, msg]);
    setInput('');
  }, [input, room, token]);

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
    } catch (e) {
      alert('No se pudo enviar la propina (¿saldo insuficiente?)');
    }
  }, [tipAmount, tipTarget, room, token]);

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
          <Link href="/wallet" className="rounded-md bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100">
            Monedero
          </Link>
          {token && (
            <button
              onClick={() => {
                setSession('', { id: '', email: '', displayName: '', role: '' });
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
              className="rounded-md bg-amber-100 p-2 text-amber-900 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100"
              title="Propina al chat"
            >
              <Coins className="h-5 w-5" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('es', 'chat.placeholder')}
              className="flex-1 rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800"
              disabled={!token}
            />
            <button type="submit" disabled={!token || !input.trim()} className="grid h-10 w-10 place-items-center rounded-md bg-brand-600 text-white disabled:opacity-50">
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
              className="absolute left-1/2 top-2/3 -translate-x-1/2 animate-tipfly select-none text-4xl"
              style={{ left: `${30 + Math.random() * 40}%` }}
            >
              {a.emoji}
            </span>
          ))}
        </div>

        {/* Tip dialog */}
        {tipTarget && (
          <div className="absolute inset-0 grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-sm space-y-3 rounded-xl bg-white p-5 dark:bg-zinc-900">
              <h3 className="text-lg font-bold">{t('es', 'tip.send')}</h3>
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
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const _apiBase = API_BASE; // referenced for completeness
