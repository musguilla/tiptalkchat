'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';

const POLL_MS = 30000;

/**
 * Speech-bubble icon with an unread-messages badge, linking to the inbox.
 * Only renders for logged-in users. Polls the unread count so the badge
 * stays fresh without a socket.
 */
export function MessagesBell({ className = '' }: { className?: string }) {
  const token = useAuth((s) => s.token);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!token) {
      setCount(0);
      return;
    }
    let cancelled = false;
    const load = (): void => {
      api<{ count: number }>('/users/me/messages/unread-count', { token })
        .then((r) => {
          if (!cancelled) setCount(r.count);
        })
        .catch(() => undefined);
    };
    load();
    const t = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [token]);

  if (!token) return null;

  return (
    <Link
      href="/mensajes"
      aria-label={count > 0 ? `Tienes ${count} mensajes sin leer` : 'Mensajes'}
      className={`relative grid h-10 w-10 place-items-center rounded-full border border-surface-container bg-white text-ink transition hover:bg-surface-soft ${className}`}
      title="Mensajes"
    >
      <MessageCircle className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-1 text-[11px] font-bold text-white shadow ring-2 ring-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
