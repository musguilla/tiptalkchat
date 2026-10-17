import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';
import {
  C_CANONICAL_SLUGS,
  C_TO_LOCALIZED,
  C_TO_CANONICAL,
} from './seo-cslug-map.generated';

/**
 * Lightweight reader for localized /c slug maps (safe to import from the edge
 * middleware — it pulls in only the precomputed map, not the SEO catalogs).
 * Regenerate the map with seo-cslug-gen.ts when SEO labels change.
 */
const CANONICAL_SET = new Set(C_CANONICAL_SLUGS);

/** Localized /c slug for a canonical slug in a locale (canonical if none). */
export function cLocalizedSlug(canonical: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return canonical;
  return C_TO_LOCALIZED[locale]?.[canonical] ?? canonical;
}

/** Canonical /c slug from a (possibly localized) slug in a locale, or null. */
export function cCanonicalSlug(slug: string, locale: Locale): string | null {
  if (locale !== DEFAULT_LOCALE) {
    const c = C_TO_CANONICAL[locale]?.[slug];
    if (c) return c;
  }
  return CANONICAL_SET.has(slug) ? slug : null;
}
