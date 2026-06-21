'use client';
import Link from 'next/link';
import { Logo } from './Logo';

export function SiteHeader({ variant = 'landing' }: { variant?: 'landing' | 'minimal' }) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center">
          <Logo className="text-2xl" />
        </Link>
        {variant === 'landing' ? (
          <>
            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
              <a href="#caracteristicas" className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                Características
              </a>
              <a href="#como-funciona" className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                Cómo funciona
              </a>
              <Link href="/login" className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                Iniciar sesión
              </Link>
            </nav>
            <Link
              href="/create"
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Crear sala
            </Link>
          </>
        ) : (
          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
            Volver
          </Link>
        )}
      </div>
    </header>
  );
}
