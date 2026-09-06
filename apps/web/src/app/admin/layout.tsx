'use client';
import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Banknote,
  LayoutDashboard,
  Lock,
  LogIn,
  LogOut,
  Image as ImageIcon,
  Mail,
  Menu,
  MessagesSquare,
  ShieldCheck,
  Users,
  X as XIcon,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-store';
import { Logo } from '@/components/Logo';
import { AuthOverlay } from '@/components/AuthOverlay';
import { Avatar } from './_components/Avatar';
import { RolePill } from './_components/RolePill';

interface NavItem {
  href: string;
  label: string;
  icon: typeof Users;
  /** Match only the exact path (used for the dashboard root). */
  exact?: boolean;
}

const NAV: ReadonlyArray<NavItem> = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { href: '/admin/salas', label: 'Salas', icon: MessagesSquare },
  { href: '/admin/media', label: 'Media', icon: ImageIcon },
  { href: '/admin/payouts', label: 'Payouts', icon: Banknote },
  { href: '/admin/contacto', label: 'Contacto', icon: Mail },
];

function isActive(item: NavItem, pathname: string): boolean {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const token = useAuth((s) => s.token);
  const user = useAuth((s) => s.user);
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Wait for Zustand persist to rehydrate before evaluating the gate so a
  // logged-in admin never sees a flash of "Acceso restringido".
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Close the mobile menu after navigating.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (!hydrated) {
    return (
      <main className="grid min-h-screen place-items-center bg-canvas">
        <div className="h-6 w-6 animate-pulse rounded-full bg-primary-200" />
      </main>
    );
  }

  if (!token || !user || user.role !== 'admin') {
    return (
      <main className="grid min-h-screen place-items-center bg-canvas p-6 text-center text-ink">
        <div className="max-w-md">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-50 text-primary-500">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight">
            Acceso restringido
          </h1>
          <p className="mt-3 text-base text-ink-muted">
            {token
              ? 'Esta zona es solo para administradores de tiptalk.chat. Tu cuenta no tiene permisos para entrar.'
              : 'Esta zona es solo para administradores de tiptalk.chat. Inicia sesión con una cuenta de administración.'}
          </p>
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="btn-tactile inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-6 py-3 text-sm font-bold text-white shadow-vivid hover:shadow-vivid-strong"
            >
              <LogIn className="h-4 w-4" />
              Iniciar sesión
            </button>
            <Link
              href="/"
              className="text-sm font-medium text-ink-muted transition hover:text-ink"
            >
              Volver al inicio
            </Link>
          </div>
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

  const navLinks = (variant: 'sidebar' | 'menu') =>
    NAV.map((item) => {
      const active = isActive(item, pathname);
      const Icon = item.icon;
      return (
        <Link
          key={item.href}
          href={item.href}
          aria-current={active ? 'page' : undefined}
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
            active
              ? 'bg-primary-50 font-semibold text-primary-700'
              : 'font-medium text-ink-muted hover:bg-surface-soft hover:text-ink'
          } ${variant === 'menu' ? 'py-2.5' : ''}`}
        >
          <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-primary-500' : ''}`} />
          {item.label}
        </Link>
      );
    });

  const adminChip = (
    <div className="flex items-center gap-3 rounded-md border border-surface-container bg-surface-soft/60 p-2.5">
      <Avatar url={user.avatarUrl} name={user.displayName} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{user.displayName}</p>
        <p className="truncate text-[11px] text-ink-muted">{user.email}</p>
      </div>
      <RolePill role={user.role} />
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* === Desktop sidebar === */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-surface-container bg-white md:flex">
        <div className="flex items-center gap-2 px-5 pb-4 pt-6">
          <Link href="/admin" className="flex items-center">
            <Logo className="text-xl" />
          </Link>
          <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            <ShieldCheck className="h-3 w-3" />
            Admin
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3" aria-label="Secciones del panel">
          {navLinks('sidebar')}
        </nav>
        <div className="space-y-2 p-3">
          {adminChip}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition hover:bg-surface-soft hover:text-ink"
          >
            <LogOut className="h-4 w-4" />
            Salir del panel
          </Link>
        </div>
      </aside>

      {/* === Mobile top bar === */}
      <header className="sticky top-0 z-40 border-b border-surface-container bg-white/90 backdrop-blur md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo className="text-lg" />
            <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              <ShieldCheck className="h-3 w-3" />
              Admin
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="grid h-9 w-9 place-items-center rounded-md text-ink transition hover:bg-surface-soft"
          >
            {menuOpen ? <XIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <nav className="space-y-1 border-t border-surface-container px-3 py-3" aria-label="Secciones del panel">
            {navLinks('menu')}
            <div className="pt-2">{adminChip}</div>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-ink-muted transition hover:bg-surface-soft hover:text-ink"
            >
              <LogOut className="h-4 w-4" />
              Salir del panel
            </Link>
          </nav>
        )}
      </header>

      {/* === Content === */}
      <div className="md:pl-60">
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
