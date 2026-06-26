'use client';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-store';

/**
 * Mounted once at the root layout. Re-fetches /auth/me at boot so the
 * locally-persisted user state catches up with any fields the server has
 * added since the session was created (most importantly avatarUrl —
 * older sessions persisted before /auth/login returned it).
 */
export function AuthBoot() {
  const refresh = useAuth((s) => s.refreshFromServer);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return null;
}
