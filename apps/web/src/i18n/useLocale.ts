'use client';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { DEFAULT_LOCALE, isLocale, type Locale } from './config';
import { t, type Key } from './index';
import { localizeHref, stripLocale } from './routing';

export { localizeHref, stripLocale } from './routing';

/** Current locale from the URL prefix (/en, /fr, …); Spanish at the root. */
export function useLocale(): Locale {
  const pathname = usePathname() || '/';
  const seg = pathname.split('/')[1] ?? '';
  return seg && isLocale(seg) && seg !== DEFAULT_LOCALE ? seg : DEFAULT_LOCALE;
}

/** Translator bound to the current locale. */
export function useT(): (key: Key, vars?: Record<string, string | number>) => string {
  const locale = useLocale();
  return useCallback((key: Key, vars?: Record<string, string | number>) => t(locale, key, vars), [locale]);
}

/** Switch to another locale, keeping the current path. */
export function useSwitchLocale(): (next: Locale) => void {
  const pathname = usePathname() || '/';
  return useCallback(
    (next: Locale) => {
      const base = stripLocale(pathname);
      const target = next === DEFAULT_LOCALE ? base : localizeHref(base, next);
      try {
        document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
      } catch {
        /* ignore */
      }
      // Full document navigation, not router.push: the home (and other pages)
      // render locale-dependent text on the SERVER via getServerLocale(). A
      // client-side push reuses the cached RSC for the shared underlying route,
      // so server-rendered strings kept the old language while client
      // components (useT) updated — i.e. "some texts didn't refresh". A hard
      // navigation guarantees a fresh server render in the new locale.
      window.location.assign(target);
    },
    [pathname],
  );
}
