/**
 * TypeScript mirrors of the `/admin/*` API contract. Keep the shapes in sync
 * with apps/api/src/routes/admin.ts — the web never invents fields.
 */

export type UserRole = 'user' | 'mod' | 'admin';
export type PayoutStatus = 'requested' | 'in_review' | 'paid' | 'failed' | 'refunded';
export type ContactStatus = 'new' | 'read' | 'archived';
export type RoomStatusFilter = 'open' | 'closed' | 'all';

// ---------------------------------------------------------------------------
// GET /admin/stats
// ---------------------------------------------------------------------------
export interface AdminStats {
  users: { total: number; last7d: number; blocked: number };
  rooms: { open: number; createdLast7d: number };
  tips: { count7d: number; tipsys7d: number; countTotal: number; tipsysTotal: number };
  payouts: { pending: number; pendingNetEurCents: number };
  contacts: { new: number };
  online: { users: number; sockets: number };
}

// ---------------------------------------------------------------------------
// GET /admin/users
// ---------------------------------------------------------------------------
export interface AdminUserRow {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
  blockedAt: string | null;
  walletBalance: number;
  openRooms: number;
  online: boolean;
}

export interface AdminUsersResponse {
  users: AdminUserRow[];
  total: number;
  page: number;
  limit: number;
}

// ---------------------------------------------------------------------------
// GET /admin/users/:id
// ---------------------------------------------------------------------------
export interface AdminUserDetailUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  kycStatus: string;
  emailVerified: boolean;
  blockedAt: string | null;
  createdAt: string;
}

export interface AdminConnectInfo {
  stripeAccountId: string;
  status: string;
  payoutsEnabled: boolean;
}

export interface AdminUserRoom {
  id: string;
  slug: string;
  name: string;
  createdAt: string;
  closedAt: string | null;
  membersCount: number;
  messagesCount: number;
  liveCount: number;
}

export interface AdminPhoto {
  id: string;
  url: string;
  isPublic: boolean;
  createdAt: string;
}

export interface AdminUserPayout {
  id: string;
  tipsys: number;
  netEurCents: number;
  status: PayoutStatus;
  createdAt: string;
  paidAt: string | null;
}

export interface AdminLedgerEntry {
  id: string;
  kind: string;
  amount: number;
  balanceAfter: number;
  createdAt: string;
}

export interface AdminUserDetail {
  user: AdminUserDetailUser;
  online: boolean;
  wallet: { balance: number };
  connect: AdminConnectInfo | null;
  rooms: AdminUserRoom[];
  photos: AdminPhoto[];
  payouts: AdminUserPayout[];
  tips: {
    received: { count: number; tipsys: number };
    sent: { count: number; tipsys: number };
  };
  recentLedger: AdminLedgerEntry[];
}

export interface BlockResponse {
  blockedAt: string | null;
}

export interface RoleResponse {
  role: UserRole;
}

// ---------------------------------------------------------------------------
// GET /admin/rooms
// ---------------------------------------------------------------------------
export interface AdminRoomCreator {
  kind: 'user' | 'guest';
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface AdminRoomRow {
  id: string;
  slug: string;
  name: string;
  createdAt: string;
  closedAt: string | null;
  creator: AdminRoomCreator | null;
  membersCount: number;
  messagesCount: number;
  liveCount: number;
}

export interface AdminRoomsResponse {
  rooms: AdminRoomRow[];
  total: number;
  page: number;
  limit: number;
}

export interface CloseRoomResponse {
  closed: boolean;
}

// ---------------------------------------------------------------------------
// GET /admin/payouts
// ---------------------------------------------------------------------------
export interface AdminPayoutRow {
  id: string;
  userId: string;
  user: { email: string; displayName: string; avatarUrl: string | null };
  tipsys: number;
  grossEurCents: number;
  feeEurCents: number;
  netEurCents: number;
  status: PayoutStatus;
  createdAt: string;
  paidAt: string | null;
  failureReason: string | null;
  stripeTransferId: string | null;
  connect: { stripeAccountId: string; payoutsEnabled: boolean } | null;
}

export interface AdminPayoutsResponse {
  payouts: AdminPayoutRow[];
}

// ---------------------------------------------------------------------------
// GET /admin/contacts
// ---------------------------------------------------------------------------
export interface AdminContactRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export interface AdminContactsResponse {
  contacts: AdminContactRow[];
}

// ---------------------------------------------------------------------------
// GET /admin/calls  (live cameras)
// ---------------------------------------------------------------------------
export interface AdminLiveCallCreator {
  kind: 'user' | 'guest';
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface AdminLiveCallRecording {
  id: string;
  egressId: string;
  startedAt: string;
}

export interface AdminLiveCall {
  roomId: string | null;
  slug: string;
  name: string;
  closed: boolean;
  participants: number;
  startedAt: number | null;
  creator: AdminLiveCallCreator | null;
  recording: AdminLiveCallRecording | null;
}

export interface AdminLiveCallsResponse {
  configured: boolean;
  recordingAvailable: boolean;
  calls: AdminLiveCall[];
}

export interface AdminObserveTokenResponse {
  token: string;
  url: string;
  roomName: string;
  identity: string;
}
