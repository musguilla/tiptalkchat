export interface Identity {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  isGuest: boolean;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  kind: 'text' | 'image' | 'video' | 'system';
  body: string | null;
  mediaId: string | null;
  author: Identity | null;
  createdAt: string;
}
