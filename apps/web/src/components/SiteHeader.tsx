'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-store';
import { Logo } from './Logo';
import { ProfileOverlay } from './ProfileOverlay';
import { UserChip } from './UserChip';
import { MessagesBell } from './MessagesBell';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useT, useLocale, localizeHref } from '@/i18n/useLocale';

export function SiteHeader({ variant = 'landing' }: { variant?: 'landing' | 'minimal' }) {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const clear = useAuth((s) => s.clear);
  const [profileOpen, setProfileOpen] = useState(false);
  const t = useT();
  const locale = useLocale();
  const L = (href: string): string => localizeHref(href, locale);
  return (
    <header className="sticky top-0 z-40 border-b border-surface-container bg-canvas/80 backdrop-blur-[20px]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
        {/* LEFT: logo + primary nav (tight, near the logo) + account controls */}
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-center">
            <Logo className="text-2xl" />
          </Link>
          {variant === 'landing' && (
            <nav className="hidden items-center gap-5 text-sm font-medium text-ink-muted md:flex">
              <Link href={L('/create')} className="transition hover:text-primary-500">
                {t('nav.createChat')}
              </Link>
              <a href="#como-funciona" className="transition hover:text-primary-500">
                {t('nav.howItWorks')}
              </a>
              <a href="#caracteristicas" className="transition hover:text-primary-500">
                {t('nav.features')}
              </a>
            </nav>
          )}
          {variant === 'landing' && user && (
            <div className="flex items-center gap-3.5 md:mx-3 lg:mx-5">
              <Link
                href={L('/wallet')}
                className="rounded-full border border-surface-container bg-emerald-50 px-3.5 py-1.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
              >
                {t('nav.wallet')}
              </Link>
              <MessagesBell />
              <UserChip user={user} />
              <button
                type="button"
                onClick={() => {
                  clear();
                  router.refresh();
                }}
                className="grid h-9 w-9 place-items-center rounded-md text-ink-muted transition hover:bg-surface-soft hover:text-ink"
                title={t('nav.logout')}
                aria-label={t('nav.logout')}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {variant === 'landing' ? (
          /* RIGHT: create-chat + language switcher, kept apart with air */
          <div className="flex items-center gap-4">
            {!user && (
              <Link
                href={L('/login')}
                className="text-sm font-medium text-ink-muted transition hover:text-ink"
              >
                {t('nav.login')}
              </Link>
            )}
            <Link
              href={L('/create')}
              className="btn-tactile rounded-full bg-primary-500 px-8 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-600"
            >
              {t('nav.createChat')}
            </Link>
            <LanguageSwitcher />
          </div>
        ) : (
          <Link href="/" className="text-sm text-ink-muted hover:text-ink">
            Volver
          </Link>
        )}
      </div>
      <ProfileOverlay open={profileOpen} onClose={() => setProfileOpen(false)} />
    </header>
  );
}
