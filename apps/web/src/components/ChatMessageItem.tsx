'use client';
import { Coins } from 'lucide-react';
import type { ChatMessage } from './types';

export function ChatMessageItem({
  msg,
  onTip,
}: {
  msg: ChatMessage;
  onTip: (msg: ChatMessage) => void;
}) {
  return (
    <div className="group flex items-start gap-3 rounded-lg p-2 hover:bg-zinc-50 dark:hover:bg-zinc-900">
      {msg.author?.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={msg.author.avatarUrl} alt="" className="mt-1 h-8 w-8 shrink-0 rounded-full" />
      ) : (
        <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
          {msg.author?.displayName[0]?.toUpperCase() ?? '?'}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold">{msg.author?.displayName ?? 'Anónimo'}</span>
          <span className="text-[11px] text-zinc-500">
            {new Date(msg.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        {msg.kind === 'text' && <p className="break-words text-sm">{msg.body}</p>}
        {msg.kind === 'image' && msg.mediaId && (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="" src={`/api/media/${msg.mediaId}`} className="mt-1 max-h-72 rounded-lg" />
        )}
        {msg.kind === 'video' && msg.mediaId && (
          <video controls src={`/api/media/${msg.mediaId}/master.m3u8`} className="mt-1 max-h-72 rounded-lg" />
        )}
      </div>
      <button
        onClick={() => onTip(msg)}
        className="opacity-0 transition group-hover:opacity-100"
        aria-label="Enviar propina"
        title="Tip"
      >
        <Coins className="h-5 w-5 text-amber-500 hover:text-amber-600" />
      </button>
    </div>
  );
}
