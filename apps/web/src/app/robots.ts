import type { MetadataRoute } from 'next';

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tiptalk.chat')
  .replace(/\/$/, '')
  .replace('://tiptalk.chat', '://www.tiptalk.chat');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /r/<slug> is per-conversation; not useful for search and we
        // don't want stale room URLs accumulating in the index.
        disallow: ['/r/', '/wallet', '/login', '/signup', '/admin', '/u/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
