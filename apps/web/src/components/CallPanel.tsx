'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Room,
  RoomEvent,
  Track,
  type RemoteParticipant,
  type RemoteTrack,
  type LocalTrackPublication,
} from 'livekit-client';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { api } from '@/lib/api';
import { useT } from '@/i18n/useLocale';

const CALL_WIDTH_KEY = 'tiptalk-call-width';
const CALL_WIDTH_MIN = 280;
const CALL_WIDTH_MAX = 900;
const CALL_WIDTH_DEFAULT = 320;

interface CallPanelProps {
  roomId: string;
  token: string;
  mode: 'audio' | 'video';
  onClose: () => void;
}

interface ParticipantTile {
  identity: string;
  displayName: string;
  videoEl?: HTMLVideoElement | null;
  audioEl?: HTMLAudioElement | null;
}

/**
 * Sidebar-style call panel: sits between the chat column and the users
 * sidebar on desktop, full-width on mobile. Vertical stack of participant
 * tiles, controls at the bottom.
 */
export function CallPanel({ roomId, token, mode, onClose }: CallPanelProps) {
  const t = useT();
  const [error, setError] = useState<string | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(mode === 'video');
  const [peers, setPeers] = useState<ParticipantTile[]>([]);
  const roomRef = useRef<Room | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  // Width is user-resizable via the left edge handle. Persisted across visits.
  const [width, setWidth] = useState<number>(() => {
    if (typeof window === 'undefined') return CALL_WIDTH_DEFAULT;
    const raw = window.localStorage.getItem(CALL_WIDTH_KEY);
    const parsed = raw ? parseInt(raw, 10) : NaN;
    if (!Number.isFinite(parsed)) return CALL_WIDTH_DEFAULT;
    return Math.min(Math.max(parsed, CALL_WIDTH_MIN), CALL_WIDTH_MAX);
  });

  // Mobile collapses to a top stack (full width, fixed 65vh) so the chat
  // keeps a couple of lines readable below it. The width drag handle only
  // makes sense on desktop, so we suppress the inline style on phones.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = (): void => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CALL_WIDTH_KEY, String(width));
  }, [width]);

  const startResize = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const startX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const startWidth = width;
      const onMove = (ev: MouseEvent | TouchEvent): void => {
        const currentX =
          'touches' in ev ? ev.touches[0]?.clientX ?? startX : (ev as MouseEvent).clientX;
        // Dragging the handle LEFT widens the panel.
        const delta = startX - currentX;
        const next = Math.min(
          Math.max(startWidth + delta, CALL_WIDTH_MIN),
          Math.min(CALL_WIDTH_MAX, window.innerWidth - 200),
        );
        setWidth(next);
      };
      const onUp = (): void => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onUp);
    },
    [width],
  );

  useEffect(() => {
    let cancelled = false;

    async function start(): Promise<void> {
      try {
        const tokenRes = await api<{ token: string; url: string; identity: string }>(
          '/calls/token',
          { method: 'POST', token, body: JSON.stringify({ roomId }) },
        );

        const room = new Room({ adaptiveStream: true, dynacast: true });
        roomRef.current = room;

        room.on(RoomEvent.TrackSubscribed, (track, _pub, participant) => {
          attachRemoteTrack(track, participant);
        });
        room.on(RoomEvent.TrackUnsubscribed, (track) => {
          track.detach().forEach((el) => el.remove());
        });
        room.on(RoomEvent.ParticipantDisconnected, (p) => {
          setPeers((prev) => prev.filter((t) => t.identity !== p.identity));
        });

        await room.connect(tokenRes.url, tokenRes.token);
        if (cancelled) return;

        await room.localParticipant.setMicrophoneEnabled(true);
        if (mode === 'video') {
          await room.localParticipant.setCameraEnabled(true);
        }
        attachLocalTracks(room.localParticipant.trackPublications);
      } catch (err) {
        if (!cancelled) {
          // eslint-disable-next-line no-console
          console.error('[call] failed', err);
          setError(err instanceof Error ? err.message : t('cmp.call.startFailed'));
        }
      }
    }

    void start();
    return () => {
      cancelled = true;
      roomRef.current?.disconnect();
      roomRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, token, mode]);

  function attachLocalTracks(pubs: Map<string, LocalTrackPublication>): void {
    for (const pub of pubs.values()) {
      if (pub.track && pub.kind === Track.Kind.Video && localVideoRef.current) {
        pub.track.attach(localVideoRef.current);
      }
    }
  }

  function attachRemoteTrack(track: RemoteTrack, participant: RemoteParticipant): void {
    setPeers((prev) => {
      const existing = prev.find((p) => p.identity === participant.identity);
      const tile: ParticipantTile =
        existing ?? {
          identity: participant.identity,
          displayName: participant.name || participant.identity,
        };

      if (track.kind === Track.Kind.Video) {
        const el = document.createElement('video');
        el.autoplay = true;
        el.playsInline = true;
        el.className = 'h-full w-full rounded-md object-cover bg-zinc-800';
        track.attach(el);
        tile.videoEl = el;
      } else if (track.kind === Track.Kind.Audio) {
        const el = document.createElement('audio');
        el.autoplay = true;
        track.attach(el);
        tile.audioEl = el;
      }
      return existing ? [...prev] : [...prev, tile];
    });
  }

  const toggleMic = useCallback(async () => {
    if (!roomRef.current) return;
    const next = !micOn;
    await roomRef.current.localParticipant.setMicrophoneEnabled(next);
    setMicOn(next);
  }, [micOn]);

  const toggleCam = useCallback(async () => {
    if (!roomRef.current) return;
    const next = !camOn;
    await roomRef.current.localParticipant.setCameraEnabled(next);
    if (next) attachLocalTracks(roomRef.current.localParticipant.trackPublications);
    setCamOn(next);
  }, [camOn]);

  return (
    <aside
      style={isMobile ? undefined : { width: `${width}px` }}
      className="relative flex w-full max-w-full flex-col bg-zinc-950 text-white max-md:order-1 max-md:h-[65vh] max-md:border-b max-md:border-zinc-800 md:h-full md:flex-shrink-0 md:border-l md:border-zinc-800"
    >
      {/* Drag handle on the left edge. */}
      <div
        onMouseDown={startResize}
        onTouchStart={startResize}
        role="separator"
        aria-orientation="vertical"
        aria-label={t('cmp.call.resize')}
        className="absolute left-0 top-0 z-20 hidden h-full w-1.5 -translate-x-1/2 cursor-col-resize bg-transparent transition hover:bg-primary-500/50 md:block"
      />

      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-sm font-semibold">
          {mode === 'video' ? t('cmp.call.videoTitle') : t('cmp.call.voiceTitle')}
        </span>
        <span className="text-xs text-white/60">
          {peers.length === 0
            ? t('cmp.call.waiting')
            : t('cmp.call.inCall', { count: peers.length + 1 })}
        </span>
      </div>

      {error ? (
        <div className="grid flex-1 place-items-center p-4 text-center text-sm text-red-300">
          {error}
        </div>
      ) : (
        <div className="flex-1 space-y-2 overflow-auto p-3">
          <Tile label={t('cmp.call.you')} innerRef={localVideoRef} muted hideIfNoVideo={!camOn} />
          {peers.map((p) => (
            <RemoteTile key={p.identity} tile={p} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-3 border-t border-white/10 bg-zinc-900/90 px-4 py-3">
        <button
          onClick={toggleMic}
          className={`btn-tactile grid h-11 w-11 place-items-center rounded-full ${
            micOn ? 'bg-zinc-700 text-white' : 'bg-red-600 text-white'
          }`}
          title={micOn ? t('cmp.call.mute') : t('cmp.call.unmute')}
        >
          {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </button>
        {mode === 'video' && (
          <button
            onClick={toggleCam}
            className={`btn-tactile grid h-11 w-11 place-items-center rounded-full ${
              camOn ? 'bg-zinc-700 text-white' : 'bg-red-600 text-white'
            }`}
            title={camOn ? t('cmp.call.camOff') : t('cmp.call.camOn')}
          >
            {camOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </button>
        )}
        <button
          onClick={onClose}
          className="btn-tactile grid h-11 w-11 place-items-center rounded-full bg-red-600 text-white"
          title={t('cmp.call.hangUp')}
        >
          <PhoneOff className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

function Tile({
  label,
  innerRef,
  muted,
  hideIfNoVideo,
}: {
  label: string;
  innerRef: React.RefObject<HTMLVideoElement | null>;
  muted?: boolean;
  hideIfNoVideo?: boolean;
}) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-md bg-zinc-800">
      <video
        ref={innerRef as React.RefObject<HTMLVideoElement>}
        muted={muted}
        autoPlay
        playsInline
        className={`h-full w-full object-cover ${hideIfNoVideo ? 'opacity-0' : ''}`}
      />
      {hideIfNoVideo && (
        <div className="absolute inset-0 grid place-items-center text-2xl text-white/60">
          {label[0]?.toUpperCase()}
        </div>
      )}
      <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
        {label}
      </span>
    </div>
  );
}

function RemoteTile({ tile }: { tile: ParticipantTile }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (tile.videoEl && ref.current.firstChild !== tile.videoEl) {
      ref.current.innerHTML = '';
      ref.current.appendChild(tile.videoEl);
    }
    if (tile.audioEl && !document.body.contains(tile.audioEl)) {
      document.body.appendChild(tile.audioEl);
    }
  }, [tile.videoEl, tile.audioEl]);
  return (
    <div className="relative aspect-video overflow-hidden rounded-md bg-zinc-800">
      <div ref={ref} className="absolute inset-0" />
      {!tile.videoEl && (
        <div className="absolute inset-0 grid place-items-center text-2xl text-white/60">
          {tile.displayName[0]?.toUpperCase()}
        </div>
      )}
      <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
        {tile.displayName}
      </span>
    </div>
  );
}
