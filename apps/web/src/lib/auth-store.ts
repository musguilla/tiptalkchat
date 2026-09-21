'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from './api';

export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  avatarUrl?: string | null;
}

interface AuthState {
  token: string | null;
  user: SessionUser | null;
  setSession: (token: string, user: SessionUser) => void;
  patchUser: (patch: Partial<SessionUser>) => void;
  clear: () => void;
  /** Re-fetch /auth/me and overwrite the local user. Used at boot to
   *  recover fields (like avatarUrl) that older sessions never persisted. */
  refreshFromServer: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      patchUser: (patch) =>
        set((s) => ({ user: s.user ? { ...s.user, ...patch } : s.user })),
      clear: () => set({ token: null, user: null }),
      refreshFromServer: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const fresh = await api<SessionUser>('/auth/me', { token });
          set((s) =>
            s.user ? { user: { ...s.user, ...fresh } } : { user: fresh },
          );
        } catch {
          // Never drop the session here. /auth/me is only a best-effort
          // refresh of profile fields; if it fails (offline, a transient 5xx,
          // or even a rejected token) we keep the persisted session intact so
          // the user is not logged out behind their back. Only an explicit
          // "log out" clears the session.
        }
      },
    }),
    { name: 'tiptalk-auth' },
  ),
);
