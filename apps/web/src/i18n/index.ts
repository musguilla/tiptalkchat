import type { Locale } from './config';
import { DEFAULT_LOCALE } from './config';
import { es, type MessageKey } from './locales/es';
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

export type { Locale } from './config';
export { DEFAULT_LOCALE } from './config';
export type Key = MessageKey;

type Partial = { [K in MessageKey]?: string };

const overrides: Record<Locale, Partial> = {
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
};

/** Translate a key for a locale, falling back to Spanish then the key itself. */
export function t(
  locale: Locale,
  key: MessageKey,
  vars: Record<string, string | number> = {},
): string {
  const raw = overrides[locale]?.[key] ?? es[key] ?? key;
  return Object.entries(vars).reduce<string>(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
    raw,
  );
}
