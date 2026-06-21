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
            <nav className="hidden items-center gap-8 text-sm font-medium text-ink-muted md:flex">
              <a href="#caracteristicas" className="transition hover:text-ink">
                Características
              </a>
              <a href="#como-funciona" className="transition hover:text-ink">
                Cómo funciona
              </a>
              <Link href="/login" className="transition hover:text-ink">
                Iniciar sesión
              </Link>
            </nav>
            <Link
              href="/create"
              className="btn-tactile rounded-md bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-600"
            >
              Crear sala
            </Link>
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
