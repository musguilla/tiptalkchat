import type { MetadataRoute } from 'next';
import { seoSlugs } from '@/lib/seo-pages';

/**
 * Public sitemap consumed by Search Console. Includes:
 *   - Marketing routes (home, create, contacto, legal/*)
 *   - All 42 SEO landing pages under /c/<slug>
 *
 * Authenticated routes (/wallet, /login, /signup) are excluded —
 * Google can index them on its own if it finds them, but they shouldn't
 * be promoted to organic search.
 *
 * BASE is read at build time from NEXT_PUBLIC_SITE_URL with the production
 * domain as fallback.
 */
const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tiptalk.chat').replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/create`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/contacto`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/legal/terminos`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/legal/privacidad`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/legal/aviso-legal`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/legal/cookies`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const seoRoutes: MetadataRoute.Sitemap = seoSlugs.map((slug) => ({
    url: `${BASE}/c/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...seoRoutes];
}
