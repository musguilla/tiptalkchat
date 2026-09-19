import { headers } from 'next/headers';
import { DEFAULT_LOCALE, isLocale, isRtl, type Locale } from './config';

/** Read the request locale (set by middleware via the x-locale header). */
export function getServerLocale(): Locale {
  try {
    const h = headers().get('x-locale') ?? '';
    return isLocale(h) ? h : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function getServerDir(locale: Locale): 'rtl' | 'ltr' {
  return isRtl(locale) ? 'rtl' : 'ltr';
}
