'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X as XIcon, Loader2, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { Avatar } from '@/app/admin/_components/Avatar';
import { FollowButton } from './FollowButton';

interface ListUser {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  online: boolean;
  isFollowing: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  mode: 'followers' | 'following';
  token: string | null;
  meId?: string | null;
  onNeedAuth?: () => void;
}

export function FollowListModal({ open, onClose, userId, mode, token, meId, onNeedAuth }: Props) {
  const [users, setUsers] = useState<ListUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const path = `/users/${userId}/${mode === 'followers' ? 'followers' : 'following'}`;
    api<{ users: ListUser[] }>(path, token ? { token } : {})
      .then((r) => setUsers(r.users))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, userId, mode, token, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-vivid-strong"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-surface-container px-5 py-4">
          <h2 className="font-display text-lg font-extrabold text-ink">
            {mode === 'followers' ? 'Seguidores' : 'Siguiendo'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-ink-muted transition hover:bg-surface-soft"
            aria-label="Cerrar"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="grid place-items-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-ink-soft" />
            </div>
          ) : users.length === 0 ? (
            <div className="grid place-items-center px-6 py-16 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-50 text-primary-500">
                <Users className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm text-ink-muted">
                {mode === 'followers' ? 'Todavía no tiene seguidores.' : 'Todavía no sigue a nadie.'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-surface-container">
              {users.map((u) => (
                <li key={u.id} className="flex items-center gap-3 px-4 py-3">
                  <Link
                    href={`/u/${u.id}`}
                    onClick={onClose}
                    className="flex min-w-0 flex-1 items-center gap-3 hover:opacity-80"
                  >
                    <div className="relative shrink-0">
                      <Avatar url={u.avatarUrl} name={u.displayName} size="md" />
                      {u.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                    </div>
                    <span className="truncate font-semibold text-ink">{u.displayName}</span>
                  </Link>
                  {meId !== u.id && (
                    <FollowButton
                      userId={u.id}
                      initialFollowing={u.isFollowing}
                      token={token}
                      onNeedAuth={onNeedAuth}
                      size="sm"
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
