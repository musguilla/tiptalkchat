import { DEFAULT_LOCALE, type Locale } from './config';

/**
 * Localized URL slugs per canonical route. The key is the canonical (Spanish)
 * slug that exists as an app route under /app; the value maps each non-default
 * locale to its translated slug. Spanish uses the canonical slug itself.
 *
 * Non-Latin markets use clean romanized/latin slugs (standard for URLs).
 * Only pages listed here are localized; everything else keeps its slug.
 */
export const PAGE_SLUGS: Record<string, Partial<Record<Locale, string>>> = {
  'ganar-dinero-online-chateando': {
    en: 'earn-money-online-chatting',
    fr: 'gagner-de-l-argent-en-chattant',
    de: 'online-geld-verdienen-beim-chatten',
    it: 'guadagnare-online-chattando',
    pt: 'ganhar-dinheiro-online-a-conversar',
    'pt-br': 'ganhar-dinheiro-online-conversando',
    pl: 'zarabiaj-online-czatujac',
    uk: 'zaroblyaty-groshi-spilkuyuchys',
    nl: 'online-geld-verdienen-met-chatten',
    zh: 'zaixian-liaotian-zhuanqian',
    hi: 'online-chat-karke-paise-kamaye',
    ar: 'iksib-almal-min-aldardasha',
    ru: 'zarabatyvat-obshchayas-onlayn',
    id: 'hasilkan-uang-dengan-mengobrol',
    ko: 'chaeting-euro-don-beolgi',
    ja: 'chat-de-okane-wo-kasegu',
    ur: 'chat-kar-ke-paise-kamayen',
    tr: 'sohbet-ederek-para-kazan',
    pcm: 'make-money-as-you-dey-chat',
  },
};

/** The localized slug for a canonical route in a locale (canonical for es/missing). */
export function localizedSlug(canonical: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return canonical;
  return PAGE_SLUGS[canonical]?.[locale] ?? canonical;
}

/**
 * Reverse lookup: given the first path segment and a locale, return the
 * canonical route it maps to, or null if it isn't a localized page slug.
 */
export function canonicalFromSlug(slug: string, locale: Locale): string | null {
  if (PAGE_SLUGS[slug]) return slug; // the canonical slug itself
  for (const [canonical, map] of Object.entries(PAGE_SLUGS)) {
    if (map[locale] === slug) return canonical;
  }
  return null;
}
