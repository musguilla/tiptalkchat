'use client';
import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * Tiny helper around `useSearchParams` for list pages: read the current query
 * and patch keys with `router.replace` so a refresh keeps filters/page.
 * Empty-string or null values remove the key.
 */
export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const set = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === '') next.delete(key);
        else next.set(key, value);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return { searchParams, set };
}

/** Parse `?page=` defensively (>= 1, integer). */
export function readPage(searchParams: URLSearchParams | { get(name: string): string | null }): number {
  const raw = Number(searchParams.get('page') ?? '1');
  return Number.isInteger(raw) && raw >= 1 ? raw : 1;
}
