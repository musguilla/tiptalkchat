'use client';
import { useEffect, useState } from 'react';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Props {
  userId: string;
  initialFollowing: boolean;
  token: string | null;
  /** Called when there's no session so the parent can open the auth modal. */
  onNeedAuth?: () => void;
  /** Notifies the parent of the new state so it can update a counter. */
  onChange?: (following: boolean, followerCount: number) => void;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Follow / unfollow toggle. Optimistic, reverts on error. Reusable anywhere a
 * user's name is shown (profile hero, discover cards, follower lists).
 */
export function FollowButton({
  userId,
  initialFollowing,
  token,
  onNeedAuth,
  onChange,
  size = 'md',
  className = '',
}: Props) {
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);

  useEffect(() => setFollowing(initialFollowing), [initialFollowing]);

  async function toggle(): Promise<void> {
    if (!token) {
      onNeedAuth?.();
      return;
    }
    const next = !following;
    setFollowing(next);
    setBusy(true);
    try {
      const res = await api<{ following: boolean; followerCount: number }>(
        `/users/${userId}/follow`,
        { method: next ? 'POST' : 'DELETE', token },
      );
      setFollowing(res.following);
      onChange?.(res.following, res.followerCount);
    } catch {
      setFollowing(!next); // revert
    } finally {
      setBusy(false);
    }
  }

  const pad = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';
  const icon = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={busy}
      className={`btn-tactile inline-flex items-center gap-1.5 rounded-full font-bold shadow-soft transition disabled:opacity-60 ${pad} ${
        following
          ? 'bg-white text-primary-600 ring-1 ring-primary-200 hover:bg-primary-50'
          : 'bg-gradient-to-r from-secondary-500 to-primary-500 text-white hover:shadow-vivid'
      } ${className}`}
    >
      {busy ? (
        <Loader2 className={`${icon} animate-spin`} />
      ) : following ? (
        <UserCheck className={icon} />
      ) : (
        <UserPlus className={icon} />
      )}
      {following ? 'Siguiendo' : 'Seguir'}
    </button>
  );
}
