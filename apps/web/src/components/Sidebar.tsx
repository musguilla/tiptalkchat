'use client';
import { Crown, X as XIcon } from 'lucide-react';
import type { Identity } from './types';
import { GalleryPicker } from './GalleryPicker';

interface RoomCreator {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  kind: 'user' | 'guest';
}

/**
 * A sidebar member is the room's owner if:
 *   - owner.kind = 'user' AND member.id === owner.id, OR
 *   - owner.kind = 'guest' AND member.isGuest AND member.displayName === owner.displayName.
 * (Anonymous host identities use `host:<displayName>` so the realtime id
 * doesn't match the DB GuestSession id — we fall back to displayName.)
 */
function isMemberTheOwner(member: Identity, owner: RoomCreator | null): boolean {
  if (!owner) return false;
  if (owner.kind === 'user') return member.id === owner.id;
  return member.isGuest && member.displayName === owner.displayName;
}

export function Sidebar({
  members,
  creator,
  canCloseRoom = false,
  onCloseRoom,
  meUserId,
  token,
  onSendGalleryPhoto,
}: {
  members: Identity[];
  creator: RoomCreator | null;
  canCloseRoom?: boolean;
  onCloseRoom?: () => void;
  /** Logged-in user id; when set, the sidebar shows the gallery picker. */
  meUserId?: string | null;
  /** Auth token for the gallery API calls. */
  token?: string | null;
  /** Called when the user picks a photo from their gallery. */
  onSendGalleryPhoto?: (url: string) => Promise<void> | void;
}) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 md:flex">
      <div className="flex-1 overflow-y-auto p-3">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
          Conectados ({members.length})
        </h3>
        <ul className="space-y-1">
          {members.map((m) => {
            const owner = isMemberTheOwner(m, creator);
            // Real users have plain ids; guest identities are prefixed
            // with 'host:' or 'guest:' (see /r/[slug] identity memo).
            const isRealUser = !m.isGuest && !m.id.startsWith('host:') && !m.id.startsWith('guest:');
            const avatarBlock = (
              <span className="relative">
                {m.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.avatarUrl}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-500 text-xs font-bold text-white">
                    {m.displayName[0]?.toUpperCase()}
                  </span>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
              </span>
            );
            return (
              <li
                key={m.id}
                className="flex items-center gap-2 rounded px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                {isRealUser ? (
                  <a
                    href={`/u/${m.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Ver perfil de ${m.displayName}`}
                    className="shrink-0 transition hover:opacity-80"
                  >
                    {avatarBlock}
                  </a>
                ) : (
                  avatarBlock
                )}
                <span className="text-sm">{m.displayName}</span>
                {owner ? (
                  <span className="ml-auto flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900 dark:bg-amber-900/50 dark:text-amber-100">
                    <Crown className="h-3 w-3" />
                    propietario
                  </span>
                ) : (
                  m.isGuest && (
                    <span className="text-[10px] text-zinc-500">(invitado)</span>
                  )
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {meUserId && token && onSendGalleryPhoto && (
        <GalleryPicker userId={meUserId} token={token} onSend={onSendGalleryPhoto} />
      )}

      {canCloseRoom && onCloseRoom && (
        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
          <button
            type="button"
            onClick={onCloseRoom}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200 hover:text-red-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            title="Cerrar sala"
          >
            <XIcon className="h-3.5 w-3.5" />
            Cerrar sala
          </button>
        </div>
      )}
    </aside>
  );
}
