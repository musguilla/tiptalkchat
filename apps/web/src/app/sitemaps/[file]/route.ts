import { buildChildSitemap, sitemapFileIds } from '@/lib/seo-sitemaps';

// Per-country (and 'core') child sitemaps, served at /sitemaps/<id>.xml.
export const dynamic = 'force-dynamic';

export function generateStaticParams(): Array<{ file: string }> {
  return sitemapFileIds().map((id) => ({ file: `${id}.xml` }));
}

export function GET(
  _req: Request,
  { params }: { params: { file: string } },
): Response {
  const id = params.file.replace(/\.xml$/, '');
  const xml = buildChildSitemap(id);
  if (!xml) return new Response('Not found', { status: 404 });
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
