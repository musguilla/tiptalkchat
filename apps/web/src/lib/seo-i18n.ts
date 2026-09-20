import { seoPageMap, type SeoPage } from './seo-pages';
import type { Locale } from '@/i18n/config';
import { en } from './seo/en';
import { fr } from './seo/fr';
import { de } from './seo/de';
import { it } from './seo/it';
import { pt } from './seo/pt';
import { ptBr } from './seo/pt-br';

type Catalog = Record<string, Partial<SeoPage>>;

// Only locales with a translated catalog are listed; everything else falls
// back to the Spanish source. Add more as their catalogs get translated.
const CATALOGS: Partial<Record<Locale, Catalog>> = {
  en,
  fr,
  de,
  it,
  pt,
  'pt-br': ptBr,
};

/** Locales that currently have translated SEO landing content. */
export function hasSeoCatalog(locale: Locale): boolean {
  return Boolean(CATALOGS[locale]);
}

/** The SEO page for a slug in a locale (translated fields over the ES base). */
export function getSeoPage(slug: string, locale: Locale): SeoPage | null {
  const base = seoPageMap[slug];
  if (!base) return null;
  const ov = CATALOGS[locale]?.[slug];
  return ov ? { ...base, ...ov } : base;
}
