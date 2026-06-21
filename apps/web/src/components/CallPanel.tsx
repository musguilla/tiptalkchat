'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Room,
  RoomEvent,
  Track,
  type RemoteParticipant,
  type RemoteTrack,
  type RemoteTrackPublication,
  type LocalTrackPublication,
} from 'livekit-client';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { api } from '@/lib/api';

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

export function CallPanel({ roomId, token, mode, onClose }: CallPanelProps) {
  const [error, setError] = useState<string | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(mode === 'video');
  const [peers, setPeers] = useState<ParticipantTile[]>([]);
  const roomRef = useRef<Room | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function start(): Promise<void> {
      try {
        const tokenRes = await api<{ token: string; url: string; identity: string }>(
          '/calls/token',
          { method: 'POST', token, body: JSON.stringify({ roomId }) },
        );

        const room = new Room({
          adaptiveStream: true,
          dynacast: true,
        });
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
          setError(err instanceof Error ? err.message : 'No se pudo iniciar la llamada');
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
        el.className = 'h-full w-full rounded-lg object-cover bg-zinc-800';
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
    <div className="absolute inset-0 z-50 flex flex-col bg-black/90 backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-white">
        <span className="text-sm font-semibold">
          {mode === 'video' ? 'Videollamada' : 'Llamada de voz'}
        </span>
        <span className="text-xs text-white/60">
          {peers.length === 0 ? 'Esperando a otros...' : `${peers.length} participante(s) más`}
        </span>
      </div>

      {error ? (
        <div className="grid flex-1 place-items-center p-6 text-center text-red-300">
          {error}
        </div>
      ) : (
        <div className="grid flex-1 grid-cols-1 gap-2 overflow-auto p-3 sm:grid-cols-2 lg:grid-cols-3">
          <Tile label="Tú" innerRef={localVideoRef} muted hideIfNoVideo={!camOn} />
          {peers.map((p) => (
            <RemoteTile key={p.identity} tile={p} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-3 border-t border-white/10 bg-zinc-900/90 px-4 py-3">
        <button
          onClick={toggleMic}
          className={`grid h-12 w-12 place-items-center rounded-full ${
            micOn ? 'bg-zinc-700 text-white' : 'bg-red-600 text-white'
          }`}
          title={micOn ? 'Silenciar' : 'Activar mic'}
        >
          {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </button>
        {mode === 'video' && (
          <button
            onClick={toggleCam}
            className={`grid h-12 w-12 place-items-center rounded-full ${
              camOn ? 'bg-zinc-700 text-white' : 'bg-red-600 text-white'
            }`}
            title={camOn ? 'Apagar cámara' : 'Encender cámara'}
          >
            {camOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>
        )}
        <button
          onClick={onClose}
          className="grid h-12 w-12 place-items-center rounded-full bg-red-600 text-white"
          title="Colgar"
        >
          <PhoneOff className="h-5 w-5" />
        </button>
      </div>
    </div>
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
    <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-800">
      <video
        ref={innerRef as React.RefObject<HTMLVideoElement>}
        muted={muted}
        autoPlay
        playsInline
        className={`h-full w-full object-cover ${hideIfNoVideo ? 'opacity-0' : ''}`}
      />
      {hideIfNoVideo && (
        <div className="absolute inset-0 grid place-items-center text-3xl text-white/60">
          {label[0]?.toUpperCase()}
        </div>
      )}
      <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
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
    <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-800">
      <div ref={ref} className="absolute inset-0" />
      {!tile.videoEl && (
        <div className="absolute inset-0 grid place-items-center text-3xl text-white/60">
          {tile.displayName[0]?.toUpperCase()}
        </div>
      )}
      <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
        {tile.displayName}
      </span>
    </div>
  );
}
