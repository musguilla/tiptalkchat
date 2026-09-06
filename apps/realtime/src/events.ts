/**
 * Wire-level event schema shared between server and client. Imported by web app
 * via a relative path in the monorepo. Keep this file pure types only — the
 * shape is the public contract.
 */

export type Identity = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  isGuest: boolean;
};

export interface MessagePayload {
  id: string;
  roomId: string;
  kind: 'text' | 'image' | 'video' | 'system';
  body: string | null;
  mediaId: string | null;
  author: Identity | null;
  createdAt: string;
}

export interface TipPayload {
  id: string;
  amount: number;
  sender: Identity;
  receiver: Identity;
  targetType: 'message' | 'media' | 'room';
  targetId: string;
  note: string | null;
  createdAt: string;
}

export interface RtcSignal {
  fromSocketId: string;
  toSocketId: string;
  signal: unknown; // Stripe-style opaque; client validates with simple-peer / webrtc.
}

export interface ClientToServerEvents {
  'room:join': (payload: { roomId: string; membershipId: string; identity: Identity }) => void;
  'room:leave': (payload: { roomId: string }) => void;
  'message:send': (payload: MessagePayload, ack: (ok: boolean) => void) => void;
  'typing:start': (payload: { roomId: string }) => void;
  'typing:stop': (payload: { roomId: string }) => void;
  'tip:broadcast': (payload: TipPayload) => void;
  'call:join': (payload: { roomId: string; socketId: string }) => void;
  'call:leave': (payload: { roomId: string }) => void;
  'call:signal': (payload: RtcSignal) => void;
  /**
   * Admin read-only observer. Joins the socket.io room to receive
   * message:new / tip:new / presence:update but is NOT a member: no
   * identity, no presence broadcast, not counted in rosters or in
   * /internal/presence, cannot send. Requires an admin JWT on the handshake.
   */
  'admin:observe': (payload: { roomId: string }, ack?: (ok: boolean) => void) => void;
  'admin:unobserve': (payload: { roomId: string }) => void;
}

export interface ServerToClientEvents {
  'room:state': (payload: { roomId: string; members: Identity[] }) => void;
  'presence:update': (payload: { roomId: string; member: Identity; online: boolean }) => void;
  'message:new': (payload: MessagePayload) => void;
  'typing:update': (payload: { roomId: string; userId: string; typing: boolean }) => void;
  'tip:new': (payload: TipPayload) => void;
  'call:peer-joined': (payload: { socketId: string; identity: Identity }) => void;
  'call:peer-left': (payload: { socketId: string }) => void;
  'call:signal': (payload: RtcSignal) => void;
  error: (payload: { code: string; message: string }) => void;
}
