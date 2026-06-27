'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, MessageCircle, ExternalLink, Lock, Settings, LogIn } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { Logo } from '@/components/Logo';
import { SiteFooter } from '@/components/SiteFooter';
import { ProfileOverlay } from '@/components/ProfileOverlay';
import { AuthOverlay } from '@/components/AuthOverlay';
import { ProfileGallery } from '@/components/ProfileGallery';

interface PublicUser {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
}

interface OpenRoom {
  id: string;
  slug: string;
  name: string;
  createdAt: string;
  membersCount: number;
  messagesCount: number;
}

export default function UserProfilePage() {
  const params = useParams<{ id: string }>();
  const meId = useAuth((s) => s.user?.id);
  const meEmail = useAuth((s) => s.user?.email);
  const token = useAuth((s) => s.token);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [rooms, setRooms] = useState<OpenRoom[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const meAvatarUrl = useAuth((s) => s.user?.avatarUrl);
  const meDisplayName = useAuth((s) => s.user?.displayName);

  const isSelf = meId === params.id;

  useEffect(() => {
    if (!params.id || !token) return;
    api<PublicUser>(`/users/${params.id}`, { token })
      .then(setUser)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
      });
  }, [params.id, token]);

  useEffect(() => {
    if (!isSelf || !token) return;
    api<{ rooms: OpenRoom[] }>('/rooms/mine', { token })
      .then((r) => setRooms(r.rooms))
      .catch(() => undefined);
  }, [isSelf, token]);

  if (notFound) {
    return (
      <main className="grid min-h-screen place-items-center bg-canvas p-6 text-center">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            Perfil no encontrado
          </h1>
          <p className="mt-3 text-base text-ink-muted">
            Este usuario no existe o ya no está disponible.
          </p>
          <Link
            href="/"
            className="btn-tactile mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-6 py-3 text-sm font-bold text-white shadow-vivid hover:shadow-vivid-strong"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  // Auth gate — profiles are visible only to logged-in users.
  if (!token) {
    return (
      <main className="grid min-h-screen place-items-center bg-canvas p-6 text-center">
        <div className="max-w-md">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-50 text-primary-500">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight">
            Perfil privado
          </h1>
          <p className="mt-3 text-base text-ink-muted">
            Los perfiles de tiptalk.chat solo se ven con una cuenta. Inicia sesión o
            crea una en menos de un minuto.
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

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <header className="border-b border-surface-container bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center">
            <Logo className="text-xl" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-ink-muted transition hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        {/* === Hero / identity card === */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-500 to-primary-500 p-8 text-white shadow-vivid-strong sm:p-10">
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:items-end sm:text-left">
            <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-full bg-white/20 ring-4 ring-white/40 shadow-2xl sm:h-32 sm:w-32">
              {(isSelf ? meAvatarUrl : user?.avatarUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={(isSelf ? meAvatarUrl : user?.avatarUrl) ?? undefined}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-display text-5xl font-extrabold">
                  {(isSelf ? meDisplayName : user?.displayName)?.[0]?.toUpperCase() ?? '?'}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                {(isSelf ? meDisplayName : user?.displayName) ?? '…'}
              </h1>
              {isSelf && meEmail && (
                <p className="mt-1 text-sm text-white/80">{meEmail}</p>
              )}
              {user && (
                <p className="mt-2 text-xs text-white/70">
                  En tiptalk.chat desde{' '}
                  {new Date(user.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </p>
              )}
              {isSelf && (
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  className="btn-tactile mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-primary-500 shadow-soft transition hover:shadow-vivid"
                >
                  <Settings className="h-4 w-4" />
                  Editar perfil
                </button>
              )}
            </div>
          </div>
        </section>

        {/* === Open rooms (self only) === */}
        {isSelf && (
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-extrabold tracking-tight">
                Tus chats abiertos
              </h2>
              <Link
                href="/create"
                className="text-sm font-semibold text-primary-500 hover:underline"
              >
                + Crear sala
              </Link>
            </div>
            {rooms.length === 0 ? (
              <div className="rounded-xl border border-dashed border-surface-container bg-white p-8 text-center">
                <MessageCircle className="mx-auto h-10 w-10 text-ink-soft" />
                <p className="mt-3 text-sm text-ink-muted">
                  No tienes salas abiertas ahora mismo.
                </p>
                <Link
                  href="/create"
                  className="btn-tactile mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft hover:shadow-vivid"
                >
                  Abre tu primera sala
                </Link>
              </div>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {rooms.map((r) => (
                  <li key={r.id}>
                    <a
                      href={`/r/${r.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 rounded-xl border border-surface-container bg-white p-4 transition hover:border-primary-300 hover:shadow-soft"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-display font-bold text-ink">{r.name}</p>
                        <p className="truncate text-xs text-ink-muted">/r/{r.slug}</p>
                        <p className="mt-1 text-[10px] text-ink-soft">
                          {r.membersCount} miembro(s) · {r.messagesCount} mensaje(s)
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 shrink-0 text-ink-muted transition group-hover:text-primary-500" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* === Gallery === */}
        <ProfileGallery
          userId={params.id}
          isSelf={isSelf}
          token={token}
          ownRooms={rooms}
        />
      </main>

      <SiteFooter />

      <ProfileOverlay open={editOpen} onClose={() => setEditOpen(false)} />
    </div>
  );
}
