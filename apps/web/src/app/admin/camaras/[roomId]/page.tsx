'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Room,
  RoomEvent,
  Track,
  type RemoteParticipant,
  type RemoteTrack,
} from 'livekit-client';
import {
  ArrowLeft,
  Circle,
  Eye,
  EyeOff,
  Loader2,
  Users,
  Video,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useT } from '@/i18n/useLocale';
import type {
  AdminLiveCallsResponse,
  AdminObserveTokenResponse,
} from '../../_components/types';

interface Tile {
  identity: string;
  displayName: string;
  videoEl?: HTMLVideoElement;
  hasAudio: boolean;
}

export default function AdminCamaraViewerPage() {
  const t = useT();
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;
  const token = useAuth((s) => s.token);

  const [status, setStatus] = useState<'connecting' | 'live' | 'error'>('connecting');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [roomName, setRoomName] = useState<string>('');

  // Recording state
  const [recordingAvailable, setRecordingAvailable] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recBusy, setRecBusy] = useState(false);
  const [recError, setRecError] = useState<string | null>(null);

  const roomRef = useRef<Room | null>(null);

  // --- Pull this room's meta + recording state from the live-calls list. ---
  const refreshMeta = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api<AdminLiveCallsResponse>('/admin/calls', { token });
      setRecordingAvailable(res.recordingAvailable);
      const mine = res.calls.find((c) => c.roomId === roomId);
      if (mine) {
        setRoomName(mine.name);
        setRecording(mine.recording !== null);
      }
    } catch {
      /* non-fatal */
    }
  }, [token, roomId]);

  useEffect(() => {
    void refreshMeta();
  }, [refreshMeta]);

  // --- Connect as a hidden observer. ---
  useEffect(() => {
    if (!token || !roomId) return;
    let cancelled = false;

    async function connect(): Promise<void> {
      if (!token) return;
      try {
        const auth = await api<AdminObserveTokenResponse>(
          `/admin/calls/${roomId}/observe-token`,
          { method: 'POST', token },
        );
        if (cancelled) return;

        const room = new Room({ adaptiveStream: true });
        roomRef.current = room;

        room.on(RoomEvent.TrackSubscribed, (track, _pub, participant) => {
          attachTrack(track, participant);
        });
        room.on(RoomEvent.TrackUnsubscribed, (track, _pub, participant) => {
          track.detach().forEach((el) => el.remove());
          if (track.kind === Track.Kind.Video) {
            setTiles((prev) =>
              prev.map((t) =>
                t.identity === participant.identity ? { ...t, videoEl: undefined } : t,
              ),
            );
          }
        });
        room.on(RoomEvent.ParticipantDisconnected, (p) => {
          setTiles((prev) => prev.filter((t) => t.identity !== p.identity));
        });
        room.on(RoomEvent.AudioPlaybackStatusChanged, () => {
          setAudioBlocked(!room.canPlaybackAudio);
        });
        room.on(RoomEvent.Disconnected, () => {
          if (!cancelled) setStatus('error');
        });

        await room.connect(auth.url, auth.token);
        if (cancelled) {
          room.disconnect();
          return;
        }
        setStatus('live');
        setAudioBlocked(!room.canPlaybackAudio);
        // Seed tiles for participants already publishing.
        room.remoteParticipants.forEach((p) => {
          p.trackPublications.forEach((pub) => {
            if (pub.track) attachTrack(pub.track, p);
          });
        });
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setErrorMsg(err instanceof Error ? err.message : t('adb.viewer.connectFailed'));
        }
      }
    }

    void connect();
    return () => {
      cancelled = true;
      roomRef.current?.disconnect();
      roomRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, roomId]);

  function attachTrack(track: RemoteTrack, participant: RemoteParticipant): void {
    setTiles((prev) => {
      const existing = prev.find((t) => t.identity === participant.identity);
      const base: Tile =
        existing ?? {
          identity: participant.identity,
          displayName: participant.name || participant.identity,
          hasAudio: false,
        };

      if (track.kind === Track.Kind.Video) {
        const el = document.createElement('video');
        el.autoplay = true;
        el.playsInline = true;
        el.muted = true; // video element muted; audio plays via its own <audio>
        el.className = 'h-full w-full object-cover';
        track.attach(el);
        base.videoEl = el;
      } else if (track.kind === Track.Kind.Audio && !base.hasAudio) {
        const el = document.createElement('audio');
        el.autoplay = true;
        el.dataset.observer = base.identity;
        track.attach(el);
        document.body.appendChild(el);
        base.hasAudio = true;
      }
      return existing ? prev.map((t) => (t.identity === base.identity ? { ...base } : t)) : [...prev, base];
    });
  }

  async function enableAudio(): Promise<void> {
    try {
      await roomRef.current?.startAudio();
      setAudioBlocked(false);
    } catch {
      /* keep the button */
    }
  }

  async function toggleRecording(): Promise<void> {
    if (!token) return;
    setRecBusy(true);
    setRecError(null);
    try {
      if (recording) {
        await api(`/admin/calls/${roomId}/recording/stop`, { method: 'POST', token });
        setRecording(false);
      } else {
        await api(`/admin/calls/${roomId}/recording/start`, { method: 'POST', token });
        setRecording(true);
      }
    } catch (err) {
      setRecError(err instanceof Error ? err.message : t('adb.viewer.recToggleFailed'));
    } finally {
      setRecBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/camaras"
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-ink-muted transition hover:bg-surface-soft hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('adb.viewer.backCameras')}
          </Link>
          <div>
            <h1 className="font-display text-xl font-extrabold tracking-tight text-ink">
              {roomName || t('adb.viewer.liveRoom')}
            </h1>
            <p className="inline-flex items-center gap-1.5 text-xs text-emerald-600">
              <EyeOff className="h-3.5 w-3.5" />
              {t('adb.viewer.observing')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {audioBlocked && status === 'live' && (
            <button
              type="button"
              onClick={() => void enableAudio()}
              className="btn-tactile inline-flex items-center gap-1.5 rounded-md bg-ink px-3 py-2 text-xs font-semibold text-white shadow-soft"
            >
              <VolumeX className="h-3.5 w-3.5" />
              {t('adb.viewer.enableSound')}
            </button>
          )}
          {recordingAvailable && (
            <button
              type="button"
              onClick={() => void toggleRecording()}
              disabled={recBusy}
              className={`btn-tactile inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold shadow-soft disabled:opacity-60 ${
                recording
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-white text-red-600 ring-1 ring-red-200 hover:bg-red-50'
              }`}
            >
              {recBusy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Circle className={`h-3.5 w-3.5 ${recording ? 'animate-pulse fill-current' : 'fill-current'}`} />
              )}
              {recording ? t('adb.viewer.stopRec') : t('adb.viewer.record')}
            </button>
          )}
        </div>
      </div>

      {recError && (
        <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {recError}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-surface-container bg-zinc-950 shadow-vivid">
        {status === 'connecting' ? (
          <div className="grid aspect-video place-items-center text-white/70">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
              <p className="mt-3 text-sm">{t('adb.viewer.connecting')}</p>
            </div>
          </div>
        ) : status === 'error' ? (
          <div className="grid aspect-video place-items-center text-center text-white/70">
            <div>
              <VolumeX className="mx-auto h-8 w-8" />
              <p className="mt-3 text-sm">{errorMsg ?? t('adb.viewer.callEnded')}</p>
              <Link
                href="/admin/camaras"
                className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20"
              >
                {t('adb.viewer.backToCameras')}
              </Link>
            </div>
          </div>
        ) : tiles.length === 0 ? (
          <div className="grid aspect-video place-items-center text-center text-white/60">
            <div>
              <Video className="mx-auto h-8 w-8" />
              <p className="mt-3 text-sm">{t('adb.viewer.waiting')}</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-2 p-2 sm:grid-cols-2">
            {tiles.map((t) => (
              <VideoTile key={t.identity} tile={t} />
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 flex items-center gap-2 text-xs text-ink-muted">
        <Users className="h-3.5 w-3.5" />
        {t('adb.viewer.participants', { count: tiles.length })}
      </p>
    </div>
  );
}

function VideoTile({ tile }: { tile: Tile }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';
    if (tile.videoEl) ref.current.appendChild(tile.videoEl);
  }, [tile.videoEl]);

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-800">
      <div ref={ref} className="absolute inset-0" />
      {!tile.videoEl && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-white/10 text-2xl font-bold text-white/70">
            {tile.displayName[0]?.toUpperCase() ?? '?'}
          </div>
        </div>
      )}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[11px] text-white">
        {tile.videoEl ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        <span className="max-w-[160px] truncate">{tile.displayName}</span>
        {tile.hasAudio ? (
          <Volume2 className="h-3 w-3 text-emerald-400" />
        ) : (
          <VolumeX className="h-3 w-3 text-white/40" />
        )}
      </div>
    </div>
  );
}
