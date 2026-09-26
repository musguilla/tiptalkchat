import { seoSlugs, COUNTRY_REGIONS } from './seo-pages';

/**
 * Segmented sitemaps: a sitemap index (/sitemap.xml) that points to one child
 * sitemap per country (/sitemaps/<pais>.xml) plus a 'core' sitemap for the
 * rest. This lets Search Console report indexation per country so we can see
 * which markets are working and prioritise. Profiles (/u/) stay out for now.
 */
const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tiptalk.chat').replace(/\/$/, '');

const STATIC_PATHS: Array<{ path: string; priority: number }> = [
  { path: '/', priority: 1 },
  { path: '/ganar-dinero-online-chateando', priority: 0.9 },
  { path: '/create', priority: 0.8 },
  { path: '/contacto', priority: 0.4 },
  { path: '/legal/terminos', priority: 0.3 },
  { path: '/legal/privacidad', priority: 0.3 },
  { path: '/legal/aviso-legal', priority: 0.3 },
  { path: '/legal/cookies', priority: 0.3 },
];

interface Group {
  id: string;
  slugs: string[];
}

/** country key ('chat-argentina', 'chat-espana-pais') → file id ('argentina', 'espana'). */
function countryId(key: string): string {
  return key.replace(/^chat-/, '').replace(/-pais$/, '');
}

function buildGroups(): Group[] {
  const all = new Set(seoSlugs);
  const assigned = new Set<string>();
  const groups: Group[] = [];

  for (const [key, info] of Object.entries(COUNTRY_REGIONS)) {
    const slugs: string[] = [];
    const add = (s: string): void => {
      if (all.has(s) && !assigned.has(s)) {
        slugs.push(s);
        assigned.add(s);
      }
    };
    add(key); // the country landing itself (chat-argentina, chat-espana-pais…)
    if (key === 'chat-espana-pais') add('chat-espana'); // bespoke Spain hub
    for (const r of info.regions) add(r.slug);
    groups.push({ id: countryId(key), slugs });
  }

  // Everything not tied to a country (features, "en español", cities, …).
  const core = seoSlugs.filter((s) => !assigned.has(s));
  return [{ id: 'core', slugs: core }, ...groups];
}

export function sitemapFileIds(): string[] {
  return buildGroups().map((g) => g.id);
}

function urlEntry(loc: string, lastmod: string, priority: number): string {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
}

export function buildSitemapIndex(): string {
  const now = new Date().toISOString();
  const items = sitemapFileIds()
    .map(
      (id) =>
        `  <sitemap>\n    <loc>${BASE}/sitemaps/${id}.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}

export function buildChildSitemap(id: string): string | null {
  const group = buildGroups().find((g) => g.id === id);
  if (!group) return null;
  const now = new Date().toISOString();
  const urls: string[] = [];
  if (id === 'core') {
    for (const s of STATIC_PATHS) urls.push(urlEntry(`${BASE}${s.path}`, now, s.priority));
  }
  for (const slug of group.slugs) urls.push(urlEntry(`${BASE}/c/${slug}`, now, 0.7));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}
