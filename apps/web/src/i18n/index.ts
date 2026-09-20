import type { Locale } from './config';
import { DEFAULT_LOCALE, LOCALES } from './config';
import { es } from './locales/es';
import { en } from './locales/en';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { it } from './locales/it';
import { pt } from './locales/pt';
import { ptBr } from './locales/pt-br';
import { pl } from './locales/pl';
import { uk } from './locales/uk';
import { nl } from './locales/nl';
import { zh } from './locales/zh';
import { hi } from './locales/hi';
import { ar } from './locales/ar';
import { ru } from './locales/ru';
import { id } from './locales/id';
import { ko } from './locales/ko';
import { ja } from './locales/ja';
import { ur } from './locales/ur';
import { tr } from './locales/tr';
import { pcm } from './locales/pcm';
import { gen } from './gen';

export type { Locale } from './config';
export { DEFAULT_LOCALE } from './config';
// Keys are plain strings now — the dictionary is assembled from the base
// locale files plus the generated namespace files (see ./gen).
export type Key = string;

type Dict = Record<string, string>;

const base: Record<Locale, Dict> = {
  es,
  en,
  fr,
  de,
  it,
  pt,
  'pt-br': ptBr,
  pl,
  uk,
  nl,
  zh,
  hi,
  ar,
  ru,
  id,
  ko,
  ja,
  ur,
  tr,
  pcm,
};

// Assemble the final dictionary per locale: base file + generated namespaces.
const DICT: Record<Locale, Dict> = Object.fromEntries(
  LOCALES.map((loc) => [loc, { ...(base[loc] ?? {}), ...(gen[loc] ?? {}) }]),
) as Record<Locale, Dict>;

/** Translate a key for a locale, falling back to Spanish then the key itself. */
export function t(
  locale: Locale,
  key: string,
  vars: Record<string, string | number> = {},
): string {
  const raw = DICT[locale]?.[key] ?? DICT[DEFAULT_LOCALE]?.[key] ?? key;
  return Object.entries(vars).reduce<string>(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
    raw,
  );
}
