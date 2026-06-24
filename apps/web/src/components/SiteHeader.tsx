'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-store';
import { Logo } from './Logo';

export function SiteHeader({ variant = 'landing' }: { variant?: 'landing' | 'minimal' }) {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const clear = useAuth((s) => s.clear);
  return (
    <header className="sticky top-0 z-40 border-b border-surface-container bg-canvas/80 backdrop-blur-[20px]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center">
          <Logo className="text-2xl" />
        </Link>
        {variant === 'landing' ? (
          <>
            <nav className="hidden items-center gap-10 text-sm font-medium text-ink-muted md:flex">
              <Link href="/create" className="transition hover:text-primary-500">
                Crear chat
              </Link>
              <a href="#como-funciona" className="transition hover:text-primary-500">
                Cómo funciona
              </a>
              <a href="#caracteristicas" className="transition hover:text-primary-500">
                Características
              </a>
            </nav>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href="/wallet"
                    className="flex items-center gap-2 rounded-full border border-surface-container bg-white px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-surface-soft"
                    title="Ir al monedero"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-500 text-xs font-bold text-white">
                      {user.displayName[0]?.toUpperCase() ?? '?'}
                    </span>
                    <span className="hidden sm:inline">{user.displayName}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      clear();
                      router.refresh();
                    }}
                    className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-ink-muted transition hover:text-ink"
                    title="Cerrar sesión"
                    aria-label="Cerrar sesión"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Cerrar sesión</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-ink-muted transition hover:text-ink"
                >
                  Iniciar sesión
                </Link>
              )}
              <Link
                href="/create"
                className="btn-tactile rounded-full bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-600"
              >
                Crear chat
              </Link>
            </div>
          </>
        ) : (
          <Link href="/" className="text-sm text-ink-muted hover:text-ink">
            Volver
          </Link>
        )}
      </div>
    </header>
  );
}
