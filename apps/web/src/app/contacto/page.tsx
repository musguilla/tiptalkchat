'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowLeft } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useT } from '@/i18n/useLocale';
import { Logo } from '@/components/Logo';
import { SiteFooter } from '@/components/SiteFooter';

export default function ContactPage() {
  const t = useT();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await api('/contact', {
        method: 'POST',
        body: JSON.stringify({ name, email, subject, message }),
      });
      setSent(true);
    } catch (err) {
      const msg =
        err instanceof ApiError && err.payload && typeof err.payload === 'object'
          ? ((err.payload as { message?: string }).message ?? null)
          : null;
      setError(msg ?? t('pg.contact.sendError'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <header className="border-b border-surface-container">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center">
            <Logo className="text-xl" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-ink-muted transition hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('pg.contact.back')}
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">{t('pg.contact.title')}</h1>
        <p className="mt-3 text-base text-ink-muted">
          {t('pg.contact.intro')}
        </p>

        {sent ? (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white">
              <Check className="h-6 w-6" />
            </div>
            <h2 className="font-display text-xl font-bold">{t('pg.contact.sentTitle')}</h2>
            <p className="max-w-sm text-sm text-emerald-900/80">
              {t('pg.contact.sentBody')}
            </p>
            <Link
              href="/"
              className="btn-tactile mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft hover:shadow-vivid"
            >
              {t('pg.contact.backHome')}
            </Link>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="mt-8 space-y-5 rounded-xl border border-surface-container bg-white p-7 shadow-soft"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block space-y-1.5 text-sm">
                <span className="font-medium text-ink">{t('pg.contact.name')}</span>
                <input
                  required
                  maxLength={80}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-transparent bg-surface-soft p-2.5 outline-none transition focus:border-primary-500 focus:bg-white"
                />
              </label>
              <label className="block space-y-1.5 text-sm">
                <span className="font-medium text-ink">{t('pg.contact.email')}</span>
                <input
                  required
                  type="email"
                  maxLength={120}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-transparent bg-surface-soft p-2.5 outline-none transition focus:border-primary-500 focus:bg-white"
                />
              </label>
            </div>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium text-ink">{t('pg.contact.subject')}</span>
              <input
                required
                maxLength={120}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-md border border-transparent bg-surface-soft p-2.5 outline-none transition focus:border-primary-500 focus:bg-white"
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium text-ink">{t('pg.contact.message')}</span>
              <textarea
                required
                rows={6}
                maxLength={4000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-y rounded-md border border-transparent bg-surface-soft p-2.5 outline-none transition focus:border-primary-500 focus:bg-white"
              />
              <span className="block text-right text-[10px] text-ink-soft">
                {message.length}/4000
              </span>
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="btn-tactile w-full rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-4 py-3 font-bold text-white shadow-vivid hover:shadow-vivid-strong disabled:opacity-60"
            >
              {busy ? t('pg.contact.sending') : t('pg.contact.send')}
            </button>
          </form>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
