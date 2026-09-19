'use client';

import { useEffect, useState } from 'react';
import { Heart, MessageCircle, UsersRound } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { AuthOverlay } from '@/components/AuthOverlay';
import { MessageComposerModal } from '@/components/MessageComposerModal';

interface DiscoverUser {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  online: boolean;
  isFollowing: boolean;
}

/** Home rail of real members, shown as photo cards with follow + message. */
export function DiscoverPeople() {
  const token = useAuth((s) => s.token);
  const [users, setUsers] = useState<DiscoverUser[]>([]);
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const [authOpen, setAuthOpen] = useState(false);
  const [composeFor, setComposeFor] = useState<DiscoverUser | null>(null);

  useEffect(() => {
    api<{ users: DiscoverUser[] }>('/users/discover', token ? { token } : {})
      .then((r) => {
        setUsers(r.users);
        setFollowing(Object.fromEntries(r.users.map((u) => [u.id, u.isFollowing])));
      })
      .catch(() => undefined);
  }, [token]);

  async function toggleFollow(u: DiscoverUser): Promise<void> {
    if (!token) {
      setAuthOpen(true);
      return;
    }
    const next = !following[u.id];
    setFollowing((prev) => ({ ...prev, [u.id]: next }));
    try {
      await api(`/users/${u.id}/follow`, { method: next ? 'POST' : 'DELETE', token });
    } catch {
      setFollowing((prev) => ({ ...prev, [u.id]: !next }));
    }
  }

  function message(u: DiscoverUser): void {
    if (!token) {
      setAuthOpen(true);
      return;
    }
    setComposeFor(u);
  }

  if (users.length === 0) return null;

  return (
    <section className="border-b border-surface-container bg-canvas py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary-50 text-primary-500">
            <UsersRound className="h-5 w-5" />
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Haz nuevos amig@s
          </h2>
          <p className="mt-3 text-base text-ink-muted">Síguelos o mándales un mensaje para chatear.</p>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {users.map((u) => (
            <article
              key={u.id}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-vivid"
            >
              <a
                href={`/u/${u.id}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver el perfil de ${u.displayName}`}
                className="absolute inset-0"
              >
                {u.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={u.avatarUrl}
                    alt=""
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-secondary-500 to-primary-500 text-5xl font-extrabold text-white">
                    {u.displayName[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 to-transparent" />
              </a>

              {/* Online badge */}
              {u.online && (
                <span className="pointer-events-none absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  En línea
                </span>
              )}

              {/* Follow heart */}
              <button
                type="button"
                onClick={() => void toggleFollow(u)}
                aria-label={following[u.id] ? 'Dejar de seguir' : 'Seguir'}
                className={`btn-tactile absolute right-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full backdrop-blur-sm transition ${
                  following[u.id]
                    ? 'bg-primary-500 text-white'
                    : 'bg-black/45 text-white hover:bg-black/60'
                }`}
              >
                <Heart className={`h-4 w-4 ${following[u.id] ? 'fill-current' : ''}`} />
              </button>

              {/* Name + message */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
                <a
                  href={`/u/${u.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 font-display text-base font-extrabold text-white drop-shadow"
                >
                  <span className="line-clamp-1">{u.displayName}</span>
                </a>
                <button
                  type="button"
                  onClick={() => message(u)}
                  aria-label={`Enviar mensaje a ${u.displayName}`}
                  className="btn-tactile inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 px-3 py-1.5 text-xs font-bold text-white shadow-soft transition hover:shadow-vivid"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Mensaje
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <AuthOverlay
        open={authOpen}
        initialMode="signup"
        onClose={() => setAuthOpen(false)}
        onSuccess={() => setAuthOpen(false)}
      />
      {composeFor && token && (
        <MessageComposerModal
          open={composeFor !== null}
          onClose={() => setComposeFor(null)}
          toUserId={composeFor.id}
          toName={composeFor.displayName}
          toAvatarUrl={composeFor.avatarUrl}
          token={token}
        />
      )}
    </section>
  );
}
