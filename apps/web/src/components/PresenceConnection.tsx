'use client';
import { useEffect } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from '@/lib/auth-store';
import { REALTIME_BASE } from '@/lib/api';

/**
 * Keeps a lightweight realtime socket open while the user is logged in, so
 * that being active anywhere on the site (not just inside a chat room) marks
 * them as "online" in presence. The socket never joins a room, sets no
 * identity and can't send — it exists only so the presence snapshot counts
 * the user. Mounted once at the root layout.
 */
export function PresenceConnection() {
  const token = useAuth((s) => s.token);

  useEffect(() => {
    if (!token) return;
    const socket: Socket = io(REALTIME_BASE, {
      auth: { token },
      transports: ['websocket'],
    });
    return () => {
      socket.disconnect();
    };
  }, [token]);

  return null;
}
