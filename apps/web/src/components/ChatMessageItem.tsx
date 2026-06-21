'use client';
import { Coins, Loader2 } from 'lucide-react';
import type { ChatMessage } from './types';
import { HlsPlayer } from './HlsPlayer';

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
        {msg.kind === 'image' && <MediaImage msg={msg} />}
        {msg.kind === 'video' && <MediaVideo msg={msg} />}
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

function MediaImage({ msg }: { msg: ChatMessage }) {
  const url = msg.media?.publicUrl;
  if (!url) return <span className="text-xs text-zinc-500">[imagen no disponible]</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={msg.body ?? 'imagen'}
      className="mt-1 max-h-72 cursor-zoom-in rounded-lg"
      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
    />
  );
}

function MediaVideo({ msg }: { msg: ChatMessage }) {
  if (!msg.media) {
    return <span className="text-xs text-zinc-500">[vídeo]</span>;
  }
  if (msg.media.status !== 'ready' || !msg.media.hlsUrl) {
    return (
      <div className="mt-1 flex items-center gap-2 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-4 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
        <Loader2 className="h-4 w-4 animate-spin" />
        Procesando vídeo… (suele tardar 30-60s)
      </div>
    );
  }
  return (
    <div className="mt-1">
      <HlsPlayer src={msg.media.hlsUrl} poster={msg.media.thumbnailUrl ?? undefined} />
    </div>
  );
}
