'use client';
import type { SessionUser } from '@/lib/auth-store';

/**
 * Pill-shaped chip showing the user's avatar (or initial fallback) and
 * displayName. Used in the landing header and inside the chat room header.
 * Clicking it opens the profile editor.
 */
export function UserChip({
  user,
  onClick,
}: {
  user: SessionUser;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border border-surface-container bg-white px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-surface-soft"
      title="Editar perfil"
    >
      {user.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
      ) : (
        <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-500 text-xs font-bold text-white">
          {user.displayName[0]?.toUpperCase() ?? '?'}
        </span>
      )}
      <span className="hidden sm:inline">{user.displayName}</span>
    </button>
  );
}
