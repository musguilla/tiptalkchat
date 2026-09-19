import { DEFAULT_LOCALE, isLocale, type Locale } from './config';

/** Prefix a path with a locale (no-op for Spanish / external URLs). */
export function localizeHref(href: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return href;
  if (!href.startsWith('/')) return href;
  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) return href;
  return href === '/' ? `/${locale}` : `/${locale}${href}`;
}

/** Strip any locale prefix from a path → the canonical Spanish path. */
export function stripLocale(pathname: string): string {
  const seg = pathname.split('/')[1] ?? '';
  if (seg && isLocale(seg) && seg !== DEFAULT_LOCALE) {
    const rest = pathname.slice(seg.length + 1);
    return rest || '/';
  }
  return pathname || '/';
}
