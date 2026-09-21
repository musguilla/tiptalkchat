'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, MessageCircle, Send, Lock, LogIn } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useT } from '@/i18n/useLocale';
import { Logo } from '@/components/Logo';
import { SiteFooter } from '@/components/SiteFooter';
import { AuthOverlay } from '@/components/AuthOverlay';
import { Avatar } from '@/app/admin/_components/Avatar';

interface ThreadPartner {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  online: boolean;
}
interface Thread {
  partner: ThreadPartner;
  lastBody: string;
  lastAt: string;
  unread: number;
}
interface ConvMessage {
  id: string;
  body: string;
  createdAt: string;
  mine: boolean;
}

function timeLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay
    ? d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}

export default function MensajesPage() {
  const t = useT();
  const token = useAuth((s) => s.token);
  const [hydrated, setHydrated] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [conv, setConv] = useState<{ partner: ThreadPartner; messages: ConvMessage[] } | null>(null);
  const [convLoading, setConvLoading] = useState(false);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setHydrated(true), []);

  const loadThreads = useCallback(() => {
    if (!token) return;
    api<{ threads: Thread[] }>('/users/me/messages', { token })
      .then((r) => setThreads(r.threads))
      .catch(() => undefined)
      .finally(() => setThreadsLoading(false));
  }, [token]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  // Poll every 15s so online dots, unread badges and the open conversation's
  // header stay fresh without re-fetching the message list (no scroll jump).
  useEffect(() => {
    if (!token) return;
    const id = window.setInterval(() => {
      api<{ threads: Thread[] }>('/users/me/messages', { token })
        .then((r) => {
          setThreads(r.threads);
          setConv((prev) => {
            if (!prev) return prev;
            const th = r.threads.find((x) => x.partner.id === prev.partner.id);
            return th
              ? { ...prev, partner: { ...prev.partner, online: th.partner.online } }
              : prev;
          });
        })
        .catch(() => undefined);
    }, 15000);
    return () => window.clearInterval(id);
  }, [token]);

  const openThread = useCallback(
    (partnerId: string) => {
      if (!token) return;
      setSelected(partnerId);
      setConvLoading(true);
      api<{ partner: ThreadPartner; messages: ConvMessage[] }>(
        `/users/me/messages/${partnerId}`,
        { token },
      )
        .then((r) => {
          setConv(r);
          // Selected thread is now read — clear its unread badge locally.
          setThreads((prev) =>
            prev.map((th) => (th.partner.id === partnerId ? { ...th, unread: 0 } : th)),
          );
        })
        .catch(() => undefined)
        .finally(() => setConvLoading(false));
    },
    [token],
  );

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [conv]);

  async function sendReply(): Promise<void> {
    const text = reply.trim();
    if (!text || !token || !selected) return;
    setSending(true);
    try {
      await api(`/users/${selected}/messages`, {
        method: 'POST',
        token,
        body: JSON.stringify({ body: text }),
      });
      setReply('');
      openThread(selected);
      loadThreads();
    } catch {
      /* noop */
    } finally {
      setSending(false);
    }
  }

  if (!hydrated) {
    return (
      <main className="grid min-h-screen place-items-center bg-canvas">
        <div className="h-6 w-6 animate-pulse rounded-full bg-primary-200" />
      </main>
    );
  }

  if (!token) {
    return (
      <main className="grid min-h-screen place-items-center bg-canvas p-6 text-center">
        <div className="max-w-md">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-50 text-primary-500">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight">{t('pg.msgs.lockedTitle')}</h1>
          <p className="mt-3 text-base text-ink-muted">
            {t('pg.msgs.lockedDesc')}
          </p>
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="btn-tactile mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-6 py-3 text-sm font-bold text-white shadow-vivid hover:shadow-vivid-strong"
          >
            <LogIn className="h-4 w-4" />
            {t('pg.msgs.signIn')}
          </button>
        </div>
        <AuthOverlay
          open={authOpen}
          initialMode="login"
          onClose={() => setAuthOpen(false)}
          onSuccess={() => setAuthOpen(false)}
        />
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <header className="border-b border-surface-container bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center">
            <Logo className="text-xl" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-ink-muted transition hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('pg.msgs.back')}
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
        <h1 className="mb-4 font-display text-2xl font-extrabold tracking-tight">{t('pg.msgs.title')}</h1>

        <div className="grid gap-4 md:grid-cols-[320px_1fr]">
          {/* === Threads list === */}
          <aside
            className={`rounded-2xl border border-surface-container bg-white shadow-soft ${
              selected ? 'hidden md:block' : ''
            }`}
          >
            {threadsLoading ? (
              <div className="grid place-items-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-ink-soft" />
              </div>
            ) : threads.length === 0 ? (
              <div className="grid place-items-center px-6 py-16 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-50 text-primary-500">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <p className="mt-3 text-sm font-semibold text-ink">{t('pg.msgs.emptyTitle')}</p>
                <p className="mt-1 max-w-[220px] text-xs text-ink-muted">
                  {t('pg.msgs.emptyDesc')}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-surface-container">
                {threads.map((th) => (
                  <li key={th.partner.id}>
                    <button
                      type="button"
                      onClick={() => openThread(th.partner.id)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-surface-soft ${
                        selected === th.partner.id ? 'bg-surface-soft' : ''
                      }`}
                    >
                      <div className="relative shrink-0">
                        <Avatar url={th.partner.avatarUrl} name={th.partner.displayName} size="md" />
                        {th.partner.online && (
                          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-semibold text-ink">{th.partner.displayName}</p>
                          <span className="shrink-0 text-[11px] text-ink-soft">{timeLabel(th.lastAt)}</span>
                        </div>
                        <p className="truncate text-xs text-ink-muted">{th.lastBody}</p>
                      </div>
                      {th.unread > 0 && (
                        <span className="grid h-5 min-w-[20px] shrink-0 place-items-center rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-1 text-[11px] font-bold text-white">
                          {th.unread}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* === Conversation === */}
          <section
            className={`flex min-h-[60vh] flex-col rounded-2xl border border-surface-container bg-white shadow-soft ${
              selected ? '' : 'hidden md:flex'
            }`}
          >
            {!selected ? (
              <div className="grid flex-1 place-items-center px-6 text-center text-ink-muted">
                <div>
                  <MessageCircle className="mx-auto h-10 w-10 text-ink-soft" />
                  <p className="mt-3 text-sm">{t('pg.msgs.pickConversation')}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 border-b border-surface-container px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="grid h-8 w-8 place-items-center rounded-md text-ink-muted transition hover:bg-surface-soft md:hidden"
                    aria-label={t('pg.msgs.backToList')}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  {conv && (
                    <Link
                      href={`/u/${conv.partner.id}`}
                      target="_blank"
                      className="flex items-center gap-3 hover:opacity-80"
                    >
                      <div className="relative">
                        <Avatar url={conv.partner.avatarUrl} name={conv.partner.displayName} size="sm" />
                        {conv.partner.online && (
                          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-display font-bold text-ink">{conv.partner.displayName}</p>
                        <p className="text-[11px] text-ink-muted">
                          {conv.partner.online ? t('pg.msgs.onlineNow') : t('pg.msgs.offline')}
                        </p>
                      </div>
                    </Link>
                  )}
                </div>

                <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
                  {convLoading && !conv ? (
                    <div className="grid h-full place-items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-ink-soft" />
                    </div>
                  ) : (
                    conv?.messages.map((m) => (
                      <div key={m.id} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-2 text-sm ${
                            m.mine
                              ? 'bg-gradient-to-r from-secondary-500 to-primary-500 text-white'
                              : 'bg-surface-soft text-ink'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{m.body}</p>
                          <p className={`mt-1 text-[10px] ${m.mine ? 'text-white/70' : 'text-ink-soft'}`}>
                            {timeLabel(m.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-surface-container p-3">
                  <div className="flex items-end gap-2">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          void sendReply();
                        }
                      }}
                      rows={1}
                      maxLength={4000}
                      placeholder={t('pg.msgs.replyPlaceholder')}
                      className="max-h-32 flex-1 resize-none rounded-xl border border-surface-container bg-surface-soft/40 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary-300 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => void sendReply()}
                      disabled={sending || reply.trim().length === 0}
                      className="btn-tactile grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 text-white shadow-soft transition hover:shadow-vivid disabled:opacity-50"
                      aria-label={t('pg.msgs.send')}
                    >
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
