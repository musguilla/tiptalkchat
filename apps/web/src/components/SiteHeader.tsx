'use client';
import Link from 'next/link';
import { Logo } from './Logo';

export function SiteHeader({ variant = 'landing' }: { variant?: 'landing' | 'minimal' }) {
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
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-ink-muted transition hover:text-ink"
              >
                Iniciar sesión
              </Link>
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
