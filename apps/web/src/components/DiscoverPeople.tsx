'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UsersRound } from 'lucide-react';
import { api } from '@/lib/api';

interface DiscoverUser {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

/** A compact home rail showing real members who chose an avatar. */
export function DiscoverPeople() {
  const [users, setUsers] = useState<DiscoverUser[]>([]);

  useEffect(() => {
    api<{ users: DiscoverUser[] }>('/users/discover')
      .then((result) => setUsers(result.users))
      .catch(() => undefined);
  }, []);

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
          <p className="mt-3 text-base text-ink-muted">
            Mándales una invitación para chatear.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-3 gap-x-4 gap-y-7 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/u/${user.id}`}
              className="group flex min-w-0 flex-col items-center text-center"
              aria-label={`Ver el perfil de ${user.displayName}`}
            >
              <div className="h-20 w-20 overflow-hidden rounded-full bg-surface-soft ring-2 ring-transparent shadow-soft transition duration-200 group-hover:-translate-y-1 group-hover:ring-primary-300 group-hover:shadow-vivid sm:h-24 sm:w-24">
                {user.avatarUrl && (
                  <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <span className="mt-2 w-full truncate text-sm font-semibold text-ink transition group-hover:text-primary-500">
                {user.displayName}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
