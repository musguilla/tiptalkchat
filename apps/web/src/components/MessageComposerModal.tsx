'use client';
import { useEffect, useState } from 'react';
import { X as XIcon, Send, Loader2, CheckCircle2, MessageSquare } from 'lucide-react';
import { api } from '@/lib/api';
import { Avatar } from '@/app/admin/_components/Avatar';
import { useT } from '@/i18n/useLocale';

interface Props {
  open: boolean;
  onClose: () => void;
  toUserId: string;
  toName: string;
  toAvatarUrl?: string | null;
  token: string;
}

/**
 * Compose + send a direct message to another user from their public profile.
 * The message lands in their in-app inbox and triggers an email nudge.
 * Only rendered when the viewer is logged in (the profile page handles the
 * "register first" path before opening this).
 */
export function MessageComposerModal({
  open,
  onClose,
  toUserId,
  toName,
  toAvatarUrl,
  token,
}: Props) {
  const t = useT();
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setBody('');
    setSent(false);
    setError(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function send(): Promise<void> {
    const text = body.trim();
    if (!text) return;
    setBusy(true);
    setError(null);
    try {
      await api(`/users/${toUserId}/messages`, {
        method: 'POST',
        token,
        body: JSON.stringify({ body: text }),
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el mensaje');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-vivid-strong"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-surface-container px-5 py-4">
          <div className="flex items-center gap-3">
            <Avatar url={toAvatarUrl ?? null} name={toName} size="sm" />
            <div className="min-w-0">
              <p className="text-xs text-ink-muted">{t('msg.composer.title')}</p>
              <p className="truncate font-display font-bold text-ink">{toName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-ink-muted transition hover:bg-surface-soft"
            aria-label="Cerrar"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {sent ? (
          <div className="px-6 py-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-500">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-4 font-display text-xl font-extrabold text-ink">{t('msg.composer.sent.title')}</h3>
            <p className="mt-2 text-sm text-ink-muted">
              {t('msg.composer.sent.body', { name: toName })}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="btn-tactile mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-6 py-2.5 text-sm font-bold text-white shadow-soft hover:shadow-vivid"
            >
              Entendido
            </button>
          </div>
        ) : (
          <div className="p-5">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              <MessageSquare className="h-3.5 w-3.5" />
              {t('msg.composer.label')}
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              maxLength={4000}
              autoFocus
              placeholder={t('msg.composer.placeholder', { name: toName })}
              className="w-full resize-none rounded-xl border border-surface-container bg-surface-soft/40 px-4 py-3 text-sm text-ink outline-none transition focus:border-primary-300 focus:bg-white focus:ring-2 focus:ring-primary-100"
            />
            {error && (
              <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-xs text-ink-soft">{body.length}/4000</span>
              <button
                type="button"
                onClick={() => void send()}
                disabled={busy || body.trim().length === 0}
                className="btn-tactile inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-6 py-2.5 text-sm font-bold text-white shadow-soft transition hover:shadow-vivid disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {t('msg.composer.send')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
