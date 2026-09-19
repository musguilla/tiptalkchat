'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  MessageCircle,
  MessagesSquare,
  ExternalLink,
  Send,
  Settings,
} from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { Logo } from '@/components/Logo';
import { SiteFooter } from '@/components/SiteFooter';
import { ProfileOverlay } from '@/components/ProfileOverlay';
import { ProfileGallery } from '@/components/ProfileGallery';
import { ProfileMoney } from '@/components/ProfileMoney';
import { SectionCard } from '@/components/SectionCard';
import { MessageComposerModal } from '@/components/MessageComposerModal';
import { MessagesBell } from '@/components/MessagesBell';
import { AuthOverlay } from '@/components/AuthOverlay';
import { FollowButton } from '@/components/FollowButton';
import { FollowListModal } from '@/components/FollowListModal';

interface PublicUser {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
  online: boolean;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
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
  const [composerOpen, setComposerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [followModal, setFollowModal] = useState<'followers' | 'following' | null>(null);
  const [authIntent, setAuthIntent] = useState<'message' | 'follow'>('message');
  const [hydrated, setHydrated] = useState(false);
  const meAvatarUrl = useAuth((s) => s.user?.avatarUrl);
  const meDisplayName = useAuth((s) => s.user?.displayName);

  // Mark hydrated after first client effect so we don't paint the gate
  // with a momentarily-null token during Zustand persist hydration.
  useEffect(() => {
    setHydrated(true);
  }, []);

  const isSelf = meId === params.id;

  useEffect(() => {
    if (!params.id) return;
    api<PublicUser>(`/users/${params.id}`, token ? { token } : {})
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

  // Wait for the auth-store to hydrate from localStorage before deciding
  // whether to show the gate. Otherwise the first render (during SSR or
  // before persist rehydrates) sees token=null and paints 'Perfil
  // privado' even for logged users.
  if (!hydrated) {
    return (
      <main className="grid min-h-screen place-items-center bg-canvas">
        <div className="h-6 w-6 animate-pulse rounded-full bg-primary-200" />
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
          <div className="flex items-center gap-3">
            <MessagesBell />
            <Link
              href="/"
              className="flex items-center gap-1 text-sm text-ink-muted transition hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        {/* === Hero / identity card === */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-500 to-primary-500 p-8 text-white shadow-vivid-strong sm:p-10">
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:items-end sm:text-left">
            <div className="flex shrink-0 flex-col items-center gap-3">
              <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-white/20 ring-4 ring-white/40 shadow-2xl sm:h-32 sm:w-32">
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
              {!isSelf && user && (
                <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      user.online ? 'animate-pulse bg-emerald-300' : 'bg-white/40'
                    }`}
                  />
                  {user.online ? 'Conectado ahora' : 'Desconectado'}
                </p>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {(isSelf ? meDisplayName : user?.displayName) ?? '…'}
                </h1>
                {!isSelf && user && (
                  <FollowButton
                    userId={user.id}
                    initialFollowing={user.isFollowing}
                    token={token}
                    onNeedAuth={() => {
                      setAuthIntent('follow');
                      setAuthOpen(true);
                    }}
                    onChange={(f, c) =>
                      setUser((prev) =>
                        prev ? { ...prev, isFollowing: f, followerCount: c } : prev,
                      )
                    }
                  />
                )}
              </div>
              {user && (
                <div className="mt-3 flex items-center justify-center gap-5 text-sm sm:justify-start">
                  <button
                    type="button"
                    onClick={() => setFollowModal('followers')}
                    className="transition hover:opacity-80"
                  >
                    <strong className="font-extrabold">{user.followerCount}</strong>{' '}
                    <span className="text-white/80">seguidores</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFollowModal('following')}
                    className="transition hover:opacity-80"
                  >
                    <strong className="font-extrabold">{user.followingCount}</strong>{' '}
                    <span className="text-white/80">siguiendo</span>
                  </button>
                </div>
              )}
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
              {isSelf ? (
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  className="btn-tactile mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-primary-500 shadow-soft transition hover:shadow-vivid"
                >
                  <Settings className="h-4 w-4" />
                  Editar perfil
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    token ? setComposerOpen(true) : (setAuthIntent('message'), setAuthOpen(true))
                  }
                  className="btn-tactile mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-primary-500 shadow-soft transition hover:shadow-vivid"
                >
                  <Send className="h-4 w-4" />
                  Mensaje
                </button>
              )}
            </div>
          </div>
        </section>

        {/* === Money: wallet, payouts, Stripe Connect (self only) === */}
        {isSelf && token && <ProfileMoney token={token} />}

        {/* === Open rooms (self only) === */}
        {isSelf && (
          <div className="mt-4">
          <SectionCard
            title="Salas"
            icon={<MessagesSquare className="h-4 w-4" />}
            action={
              <>
                <span className="text-sm text-ink-muted">{rooms.length} abierta(s)</span>
                <Link
                  href="/create"
                  className="btn-tactile inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-soft hover:shadow-vivid"
                >
                  <span className="text-sm leading-none">+</span> Crear sala
                </Link>
              </>
            }
          >
            {rooms.length === 0 ? (
              <div className="rounded-lg border border-dashed border-surface-container bg-surface-soft/50 p-8 text-center">
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
          </SectionCard>
          </div>
        )}

        {/* === Gallery === */}
        <ProfileGallery
          userId={params.id}
          isSelf={isSelf}
          token={token}
          ownRooms={rooms}
          onMessage={() =>
            token ? setComposerOpen(true) : (setAuthIntent('message'), setAuthOpen(true))
          }
        />
      </main>

      <SiteFooter />

      <ProfileOverlay open={editOpen} onClose={() => setEditOpen(false)} />

      {!isSelf && user && token && (
        <MessageComposerModal
          open={composerOpen}
          onClose={() => setComposerOpen(false)}
          toUserId={user.id}
          toName={user.displayName}
          toAvatarUrl={user.avatarUrl}
          token={token}
        />
      )}
      <AuthOverlay
        open={authOpen}
        initialMode="signup"
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          setAuthOpen(false);
          if (authIntent === 'message') setComposerOpen(true);
        }}
      />
      {user && (
        <FollowListModal
          open={followModal !== null}
          onClose={() => setFollowModal(null)}
          userId={user.id}
          mode={followModal ?? 'followers'}
          token={token}
          meId={meId}
          onNeedAuth={() => {
            setAuthIntent('follow');
            setAuthOpen(true);
          }}
        />
      )}
    </div>
  );
}
