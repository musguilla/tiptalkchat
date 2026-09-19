/**
 * i18n configuration. Spanish is the default (served at the root, no prefix).
 * Every other locale lives under its own URL prefix (/en, /fr, /pt-br, …).
 */
export const LOCALES = [
  'es', 'en', 'fr', 'de', 'it', 'pt', 'pt-br', 'pl', 'uk', 'nl',
  'zh', 'hi', 'ar', 'ru', 'id', 'ko', 'ja',
] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'es';

/** Native language names, for the language switcher. */
export const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  'pt-br': 'Português (BR)',
  pl: 'Polski',
  uk: 'Українська',
  nl: 'Nederlands',
  zh: '中文',
  hi: 'हिन्दी',
  ar: 'العربية',
  ru: 'Русский',
  id: 'Bahasa Indonesia',
  ko: '한국어',
  ja: '日本語',
};

/** Flag emoji for a nicer switcher. */
export const LOCALE_FLAGS: Record<Locale, string> = {
  es: '🇪🇸', en: '🇬🇧', fr: '🇫🇷', de: '🇩🇪', it: '🇮🇹', pt: '🇵🇹', 'pt-br': '🇧🇷',
  pl: '🇵🇱', uk: '🇺🇦', nl: '🇳🇱', zh: '🇨🇳', hi: '🇮🇳', ar: '🇸🇦', ru: '🇷🇺',
  id: '🇮🇩', ko: '🇰🇷', ja: '🇯🇵',
};

/** Locales that render right-to-left. */
export const RTL_LOCALES: Locale[] = ['ar'];

export function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

/** BCP-47 tag for Intl formatting (dates, numbers). */
export const INTL_TAG: Record<Locale, string> = {
  es: 'es-ES', en: 'en-US', fr: 'fr-FR', de: 'de-DE', it: 'it-IT', pt: 'pt-PT',
  'pt-br': 'pt-BR', pl: 'pl-PL', uk: 'uk-UA', nl: 'nl-NL', zh: 'zh-CN', hi: 'hi-IN',
  ar: 'ar', ru: 'ru-RU', id: 'id-ID', ko: 'ko-KR', ja: 'ja-JP',
};
