export interface Identity {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  isGuest: boolean;
}

export interface ChatMedia {
  id: string;
  kind: 'image' | 'video';
  status: 'uploaded' | 'processing' | 'ready' | 'failed';
  mimeType: string;
  durationMs: number | null;
  bytes: number;
  publicUrl: string | null;
  hlsUrl: string | null;
  thumbnailUrl: string | null;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  kind: 'text' | 'image' | 'video' | 'system';
  body: string | null;
  mediaId: string | null;
  media: ChatMedia | null;
  author: Identity | null;
  guest: Identity | null;
  createdAt: string;
}
