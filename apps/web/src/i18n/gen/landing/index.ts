import type { Locale } from '../../config';
import { es } from './es';
import { en } from './en';
import { fr } from './fr';
import { de } from './de';
import { it } from './it';
import { pt } from './pt';
import { ptbr } from './pt-br';
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

export const landing: Partial<Record<Locale, Record<string, string>>> = {
  es: es,
  en: en,
  fr: fr,
  de: de,
  it: it,
  pt: pt,
  'pt-br': ptbr,
  pl: pl,
  uk: uk,
  nl: nl,
  zh: zh,
  hi: hi,
  ar: ar,
  ru: ru,
  id: id,
  ko: ko,
  ja: ja,
  ur: ur,
  tr: tr,
  pcm: pcm,
};
