import { buildSitemapIndex } from '@/lib/seo-sitemaps';

// Sitemap index at /sitemap.xml → points to one child sitemap per country.
export const dynamic = 'force-dynamic';

export function GET(): Response {
  return new Response(buildSitemapIndex(), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
