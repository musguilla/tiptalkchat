export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
export const REALTIME_BASE = process.env.NEXT_PUBLIC_REALTIME_URL ?? 'http://localhost:4001';

export class ApiError extends Error {
  constructor(public status: number, public payload: unknown) {
    super(`API error ${status}`);
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
    // The JWT we sent was rejected. Drop the in-memory session AND the
    // persisted copy so the chip/sidebar stop pretending the user is
    // logged in. Dynamic import avoids a static circular import with
    // auth-store (which itself imports api).
    if (res.status === 401 && init.token && typeof window !== 'undefined') {
      void import('./auth-store')
        .then((mod) => mod.useAuth.getState().clear())
        .catch(() => undefined);
    }
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
