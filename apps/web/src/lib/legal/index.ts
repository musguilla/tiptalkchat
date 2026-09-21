import type { Locale } from '@/i18n/config';
import type { LegalCatalog, LegalDoc, LegalSlug } from './types';
import { es } from './es';
import { en } from './en';
import { fr } from './fr';
import { de } from './de';
import { it } from './it';
import { pt } from './pt';
import { ptBr } from './pt-br';
import { pl } from './pl';
import { uk } from './uk';
import { nl } from './nl';
import { zh } from './zh';
import { hi } from './hi';
import { ar } from './ar';
import { ru } from './ru';
import { id } from './id';
import { ko } from './ko';
import { ja } from './ja';
import { ur } from './ur';
import { tr } from './tr';
import { pcm } from './pcm';

const CATALOGS: Partial<Record<Locale, Partial<LegalCatalog>>> = {
  es, en, fr, de, it, pt, 'pt-br': ptBr, pl, uk, nl, zh, hi, ar, ru, id, ko, ja, ur, tr, pcm,
};

/** A legal document in a locale, falling back to the Spanish source. */
export function getLegalDoc(slug: LegalSlug, locale: Locale): LegalDoc {
  return CATALOGS[locale]?.[slug] ?? es[slug];
}
