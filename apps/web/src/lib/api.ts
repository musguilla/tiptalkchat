export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
export const REALTIME_BASE = process.env.NEXT_PUBLIC_REALTIME_URL ?? 'http://localhost:4001';

import { localizeApiMessage } from './api-errors';

export class ApiError extends Error {
  constructor(public status: number, public payload: unknown) {
    const raw =
      payload && typeof payload === 'object' && 'message' in payload
        ? (payload as { message?: unknown }).message
        : undefined;
    super(localizeApiMessage(typeof raw === 'string' ? raw : undefined) || `API error ${status}`);
  }
}

export async function api<T>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  // Only declare a JSON content-type when there's actually a body to parse,
  // otherwise Fastify rejects the request with 400 (empty body).
  if (init.body !== undefined && init.body !== null && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (init.token) headers.set('Authorization', `Bearer ${init.token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers, credentials: 'include' });
  const text = await res.text();
  const payload = text ? safeJson(text) : null;
  if (!res.ok) {
    // We deliberately DO NOT clear the session on 401 here. A single failing
    // request — a background poll, a stale guest/chat token, an endpoint the
    // user isn't authorized for, or a transient hiccup — must never log the
    // user out; that was causing surprise logouts while simply navigating
    // (e.g. leaving a profile with "Volver"). The persisted session is only
    // ever dropped by an explicit "log out". Callers handle this ApiError
    // locally (ignore it, retry, or prompt the user to sign in again).
    throw new ApiError(res.status, payload);
  }
  return payload as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}
