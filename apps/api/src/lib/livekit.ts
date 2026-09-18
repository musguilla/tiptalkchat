import {
  AccessToken,
  RoomServiceClient,
  EgressClient,
  EncodedFileOutput,
  EncodedFileType,
  S3Upload,
} from 'livekit-server-sdk';
import { loadEnv } from '@tiptalk/config';

/**
 * Shared LiveKit server helpers for the admin moderation tools:
 *   - roomServiceClient(): query live rooms / participants (ground truth)
 *   - egressClient(): start/stop moderation recordings
 *   - hiddenObserverToken(): a token that subscribes to a room without ever
 *     appearing in the roster (hidden: true) or being able to publish.
 *   - buildRecordingOutput(): S3 destination for a room-composite egress.
 *
 * LIVEKIT_URL is a wss:// signaling URL; the server APIs want an https:// host.
 */

export function livekitConfigured(): boolean {
  const env = loadEnv();
  return Boolean(
    env.SFU_PROVIDER === 'livekit' &&
      env.LIVEKIT_URL &&
      env.LIVEKIT_API_KEY &&
      env.LIVEKIT_API_SECRET,
  );
}

/** Recording is only available when the Egress S3 destination is set. */
export function recordingConfigured(): boolean {
  const env = loadEnv();
  return Boolean(
    env.LIVEKIT_RECORD_S3_ENDPOINT &&
      env.LIVEKIT_RECORD_S3_BUCKET &&
      env.LIVEKIT_RECORD_S3_ACCESS_KEY &&
      env.LIVEKIT_RECORD_S3_SECRET_KEY,
  );
}

function livekitHost(): string {
  const env = loadEnv();
  if (!env.LIVEKIT_URL) throw new Error('LIVEKIT_URL missing');
  return env.LIVEKIT_URL.replace(/^wss:\/\//, 'https://').replace(/^ws:\/\//, 'http://');
}

function creds(): { key: string; secret: string } {
  const env = loadEnv();
  if (!env.LIVEKIT_API_KEY || !env.LIVEKIT_API_SECRET) {
    throw new Error('LiveKit credentials missing');
  }
  return { key: env.LIVEKIT_API_KEY, secret: env.LIVEKIT_API_SECRET };
}

export function roomServiceClient(): RoomServiceClient {
  const { key, secret } = creds();
  return new RoomServiceClient(livekitHost(), key, secret);
}

export function egressClient(): EgressClient {
  const { key, secret } = creds();
  return new EgressClient(livekitHost(), key, secret);
}

/** LiveKit room name for a tiptalk room slug (mirrors calls.ts). */
export function livekitRoomName(slug: string): string {
  return `tiptalk:${slug}`;
}

/**
 * A read-only, invisible observer token. The moderator receives every track
 * but is never listed as a participant and cannot publish anything.
 */
export async function hiddenObserverToken(input: {
  roomSlug: string;
  adminId: string;
  adminName: string;
}): Promise<{ token: string; url: string; roomName: string; identity: string }> {
  const env = loadEnv();
  const { key, secret } = creds();
  const roomName = livekitRoomName(input.roomSlug);
  const identity = `mod-observer:${input.adminId}`;

  const at = new AccessToken(key, secret, {
    identity,
    name: input.adminName,
    ttl: 60 * 60,
  });
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: false,
    canPublishData: false,
    canSubscribe: true,
    hidden: true,
  });

  return {
    token: await at.toJwt(),
    url: env.LIVEKIT_URL as string,
    roomName,
    identity,
  };
}

/** S3 destination for a room-composite recording, keyed by room + timestamp. */
export function buildRecordingOutput(fileKey: string): EncodedFileOutput {
  const env = loadEnv();
  return new EncodedFileOutput({
    fileType: EncodedFileType.MP4,
    filepath: fileKey,
    disableManifest: true,
    output: {
      case: 's3',
      value: new S3Upload({
        accessKey: env.LIVEKIT_RECORD_S3_ACCESS_KEY as string,
        secret: env.LIVEKIT_RECORD_S3_SECRET_KEY as string,
        region: env.LIVEKIT_RECORD_S3_REGION,
        endpoint: env.LIVEKIT_RECORD_S3_ENDPOINT as string,
        bucket: env.LIVEKIT_RECORD_S3_BUCKET as string,
        forcePathStyle: true,
      }),
    },
  });
}
