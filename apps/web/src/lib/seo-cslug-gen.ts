import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';
import { seoSlugs } from './seo-pages';
import { getSeoFooterLabel } from './seo-i18n';

/**
 * Localized slugs for the /c/<slug> SEO landings.
 *
 * The localized slug is derived from the page's translated label. We only
 * localize for Latin-script locales — non-Latin markets (zh, ja, ko, ar, hi,
 * ru, uk, ur) keep the canonical slug so URLs stay clean and un-escaped
 * (standard professional practice). Spanish keeps the canonical slug too.
 *
 * Maps are built once per locale, canonical ⇄ localized, with collision-safe
 * fallback to the canonical slug so every localized slug is unique.
 */
const LATIN_LOCALES = new Set<Locale>([
  'en', 'fr', 'de', 'it', 'pt', 'pt-br', 'pl', 'nl', 'tr', 'id', 'pcm',
]);

export function slugifyLabel(label: string): string {
  const noAccents = label.normalize('NFD').replace(/[̀-ͯ]/g, '');
  return noAccents
    .toLowerCase()
    .replace(/['’.]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface LocaleMaps {
  toLocalized: Map<string, string>; // canonical → localized
  toCanonical: Map<string, string>; // localized → canonical
}

const CACHE = new Map<Locale, LocaleMaps>();
const CANONICAL_SET = new Set(seoSlugs);

function buildMaps(locale: Locale): LocaleMaps {
  const toLocalized = new Map<string, string>();
  const toCanonical = new Map<string, string>();
  if (locale === DEFAULT_LOCALE || !LATIN_LOCALES.has(locale)) {
    // Identity: canonical slugs are used as-is.
    for (const s of seoSlugs) {
      toLocalized.set(s, s);
      toCanonical.set(s, s);
    }
    return { toLocalized, toCanonical };
  }
  const taken = new Set<string>();
  for (const canonical of seoSlugs) {
    const label = getSeoFooterLabel(canonical, locale);
    const esLabel = getSeoFooterLabel(canonical, DEFAULT_LOCALE);
    let cand = slugifyLabel(label);
    // Only localize when the label is genuinely translated for this locale
    // (differs from Spanish). Pages whose content is still Spanish — e.g. the
    // templated subdivisions — keep the canonical slug, since localizing a URL
    // over Spanish content would be mismatched/harmful SEO.
    const clashesCanonical = CANONICAL_SET.has(cand) && cand !== canonical;
    if (label === esLabel || !cand || cand === canonical || taken.has(cand) || clashesCanonical) {
      cand = canonical; // keep canonical (untranslated or not unique)
    }
    taken.add(cand);
    toLocalized.set(canonical, cand);
    toCanonical.set(cand, canonical);
    // The canonical also resolves to itself (so old URLs still render).
    if (!toCanonical.has(canonical)) toCanonical.set(canonical, canonical);
  }
  return { toLocalized, toCanonical };
}

function maps(locale: Locale): LocaleMaps {
  let m = CACHE.get(locale);
  if (!m) {
    m = buildMaps(locale);
    CACHE.set(locale, m);
  }
  return m;
}

/** Localized /c slug for a canonical slug in a locale (canonical if none). */
export function cLocalizedSlug(canonical: string, locale: Locale): string {
  return maps(locale).toLocalized.get(canonical) ?? canonical;
}

/** Canonical /c slug from a (possibly localized) slug in a locale, or null. */
export function cCanonicalSlug(slug: string, locale: Locale): string | null {
  return maps(locale).toCanonical.get(slug) ?? (CANONICAL_SET.has(slug) ? slug : null);
}


/**
 * Regenerate the compact map. Run with:
 *   pnpm exec tsx -e "import {writeGeneratedMap} from './src/lib/seo-cslug-gen'; writeGeneratedMap()"
 */
export function writeGeneratedMap(): void {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs') as typeof import('fs');
  const toLoc: Record<string, Record<string, string>> = {};
  const toCan: Record<string, Record<string, string>> = {};
  for (const l of Object.keys(LATIN_SET)) {
    const a: Record<string, string> = {};
    const b: Record<string, string> = {};
    for (const slug of seoSlugs) {
      const loc = cLocalizedSlug(slug, l as Locale);
      if (loc !== slug) { a[slug] = loc; b[loc] = slug; }
    }
    if (Object.keys(a).length) { toLoc[l] = a; toCan[l] = b; }
  }
  const out =
    '// AUTO-GENERATED. Compact localized /c slug maps (non-identity only).\n' +
    'export const C_CANONICAL_SLUGS: string[] = ' + JSON.stringify(seoSlugs) + ';\n' +
    'export const C_TO_LOCALIZED: Record<string, Record<string, string>> = ' + JSON.stringify(toLoc) + ';\n' +
    'export const C_TO_CANONICAL: Record<string, Record<string, string>> = ' + JSON.stringify(toCan) + ';\n';
  fs.writeFileSync('./src/lib/seo-cslug-map.generated.ts', out);
}

const LATIN_SET: Record<string, true> = { en: true, fr: true, de: true, it: true, pt: true, 'pt-br': true, pl: true, nl: true, tr: true, id: true, pcm: true };
