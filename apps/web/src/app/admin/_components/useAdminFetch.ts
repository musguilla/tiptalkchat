'use client';
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { describeApiError } from './format';

export interface AdminFetchResult<T> {
  data: T | null;
  /** True while the FIRST load of the current path is in flight (no data yet). */
  loading: boolean;
  /** True while a `reload()` of the same path is in flight (stale data shown). */
  refreshing: boolean;
  error: string | null;
  reload: () => void;
}

interface FetchState<T> {
  path: string | null;
  data: T | null;
  error: string | null;
  fetching: boolean;
}

/**
 * GET `path` with the admin's bearer token. Re-fetches whenever `path` (or the
 * token) changes; `reload()` re-fetches the same path keeping the current data
 * on screen so polling doesn't flash skeletons. Pass `null` to idle.
 */
export function useAdminFetch<T>(path: string | null): AdminFetchResult<T> {
  const token = useAuth((s) => s.token);
  const [state, setState] = useState<FetchState<T>>({
    path,
    data: null,
    error: null,
    fetching: path !== null,
  });
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!path || !token) {
      setState({ path, data: null, error: null, fetching: false });
      return;
    }
    let cancelled = false;
    // Keep previous data only when re-fetching the same path (silent refresh);
    // a new path starts from a clean slate so lists show their skeleton.
    setState((s) => ({
      path,
      data: s.path === path ? s.data : null,
      error: null,
      fetching: true,
    }));
    api<T>(path, { token })
      .then((res) => {
        if (!cancelled) setState({ path, data: res, error: null, fetching: false });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState((s) => ({ ...s, path, error: describeApiError(err), fetching: false }));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [path, token, tick]);

  return {
    data: state.data,
    loading: state.fetching && state.data === null,
    refreshing: state.fetching && state.data !== null,
    error: state.error,
    reload,
  };
}
