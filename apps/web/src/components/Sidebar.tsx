'use client';
import type { Identity } from './types';

export function Sidebar({ members }: { members: Identity[] }) {
  return (
    <aside className="hidden w-64 shrink-0 border-l border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900 md:block">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
        Conectados ({members.length})
      </h3>
      <ul className="space-y-1">
        {members.map((m) => (
          <li key={m.id} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <span className="relative">
              {m.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.avatarUrl} alt="" className="h-7 w-7 rounded-full" />
              ) : (
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {m.displayName[0]?.toUpperCase()}
                </span>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
            </span>
            <span className="text-sm">{m.displayName}</span>
            {m.isGuest && <span className="text-[10px] text-zinc-500">(invitado)</span>}
          </li>
        ))}
      </ul>
    </aside>
  );
}
