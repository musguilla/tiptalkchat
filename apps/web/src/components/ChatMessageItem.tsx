'use client';
import { Coins, Loader2, AlertCircle, Phone, Video as VideoIcon } from 'lucide-react';
import type { ChatMessage } from './types';
import { HlsPlayer } from './HlsPlayer';

interface CallInvite {
  type: 'call_invite';
  mode: 'audio' | 'video';
  by: string;
}

function parseCallInvite(body: string | null): CallInvite | null {
  if (!body) return null;
  try {
    const parsed = JSON.parse(body) as Partial<CallInvite>;
    if (parsed.type === 'call_invite' && (parsed.mode === 'audio' || parsed.mode === 'video')) {
      return { type: 'call_invite', mode: parsed.mode, by: parsed.by ?? '' };
    }
  } catch {
    /* not JSON */
  }
  return null;
}

export function ChatMessageItem({
  msg,
  onTip,
  onRetry,
  onJoinCall,
  canTip = true,
}: {
  msg: ChatMessage;
  onTip: (msg: ChatMessage) => void;
  onRetry?: (msg: ChatMessage) => void;
  onJoinCall?: (mode: 'audio' | 'video') => void;
  /** False for the owner of the room — they can't tip themselves. */
  canTip?: boolean;
}) {
  // System call-invite messages get their own bubble (no avatar / no tip btn).
  if (msg.kind === 'system') {
    const invite = parseCallInvite(msg.body);
    if (invite) {
      const Icon = invite.mode === 'video' ? VideoIcon : Phone;
      const label = invite.mode === 'video' ? 'videollamada' : 'llamada de voz';
      return (
        <div className="my-2 px-2">
          <div className="flex w-full max-w-md items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm dark:border-emerald-900/40 dark:bg-emerald-950/30">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 text-emerald-900 dark:text-emerald-100">
              <p className="font-semibold">
                {invite.by || 'Alguien'} ha iniciado una {label}
              </p>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-200/70">
                Pulsa para unirte ahora mismo.
              </p>
            </div>
            {onJoinCall && (
              <button
                type="button"
                onClick={() => onJoinCall(invite.mode)}
                className="btn-tactile rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600"
              >
                Unirse
              </button>
            )}
          </div>
        </div>
      );
    }
    // Generic system message fallback
    return (
      <div className="my-2 px-2 text-xs text-ink-muted">
        <span className="rounded-full bg-surface-soft px-3 py-1">{msg.body}</span>
      </div>
    );
  }

  const isSending = msg.clientStatus === 'sending';
  const isFailed = msg.clientStatus === 'failed';
  return (
    <div
      className={`group flex items-start gap-3 rounded-lg p-2 transition hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
        isFailed ? 'bg-red-50/50 dark:bg-red-950/20' : ''
      }`}
    >
      {(() => {
        const who = msg.author ?? msg.guest;
        const isGuest = !msg.author && !!msg.guest;
        const node = who?.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={who.avatarUrl}
            alt=""
            className="mt-1 h-8 w-8 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${
              isGuest ? 'bg-zinc-500' : 'bg-primary-500'
            }`}
          >
            {who?.displayName[0]?.toUpperCase() ?? '?'}
          </span>
        );
        // Real users get a clickable avatar that opens their public
        // profile in a new tab. Guests don't have a profile to show.
        if (msg.author) {
          return (
            <a
              href={`/u/${msg.author.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 transition hover:opacity-80"
              title={`Ver perfil de ${msg.author.displayName}`}
            >
              {node}
            </a>
          );
        }
        return node;
      })()}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold">
            {(msg.author ?? msg.guest)?.displayName ?? 'Anónimo'}
          </span>
          {!msg.author && msg.guest && (
            <span className="rounded bg-zinc-200 px-1 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              invitado
            </span>
          )}
          <span className="text-[11px] text-zinc-500">
            {new Date(msg.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        {msg.kind === 'text' && <TextOrImage body={msg.body} />}
        {msg.kind === 'image' && <MediaImage msg={msg} />}
        {msg.kind === 'video' && <MediaVideo msg={msg} />}
        {isFailed && (
          <div className="mt-1 flex items-center gap-2 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>No se pudo enviar.</span>
            {onRetry && (
              <button
                type="button"
                onClick={() => onRetry(msg)}
                className="font-semibold underline hover:no-underline"
              >
                Reintentar
              </button>
            )}
          </div>
        )}
      </div>
      {!isSending && !isFailed && canTip && (
        <button
          onClick={() => onTip(msg)}
          className="opacity-0 transition group-hover:opacity-100"
          aria-label="Enviar propina"
          title="Tip"
        >
          <Coins className="h-5 w-5 text-amber-500 hover:text-amber-600" />
        </button>
      )}
    </div>
  );
}

/**
 * Detect bare image URLs in text bodies and render them inline. Used so
 * 'Send to chat' from the gallery picker / profile produces a real image
 * bubble instead of a clickable URL. Anything else falls back to plain
 * text.
 */
function TextOrImage({ body }: { body: string | null }) {
  if (!body) return null;
  const trimmed = body.trim();
  if (/^https?:\/\/\S+\.(?:jpe?g|png|webp|gif)(?:\?\S*)?$/i.test(trimmed)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={trimmed}
        alt=""
        className="mt-1 max-h-72 cursor-zoom-in rounded-lg"
        onClick={() => window.open(trimmed, '_blank', 'noopener,noreferrer')}
      />
    );
  }
  return <p className="break-words text-sm">{body}</p>;
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
