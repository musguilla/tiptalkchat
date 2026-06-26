'use client';
import type { SessionUser } from '@/lib/auth-store';

/**
 * Pill-shaped chip showing the user's avatar (or initial fallback) and
 * displayName. Used in the landing header and inside the chat room header.
 *
 * Behaviour:
 *  - Default (no onClick): clicking opens the public profile /u/<id> in a
 *    new tab so the user (or a viewer) keeps the current page intact.
 *  - When onClick is provided: that takes over (e.g. opens the profile
 *    editor modal in /create or in the room header).
 */
export function UserChip({
  user,
  onClick,
}: {
  user: SessionUser;
  onClick?: () => void;
}) {
  const inner = (
    <>
      {user.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
      ) : (
        <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-500 text-xs font-bold text-white">
          {user.displayName[0]?.toUpperCase() ?? '?'}
        </span>
      )}
      <span className="hidden sm:inline">{user.displayName}</span>
    </>
  );

  const className =
    'flex items-center gap-2 rounded-full border border-surface-container bg-white px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-surface-soft';

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className} title="Editar perfil">
        {inner}
      </button>
    );
  }
  return (
    <a
      href={`/u/${user.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title="Ver perfil"
    >
      {inner}
    </a>
  );
}
