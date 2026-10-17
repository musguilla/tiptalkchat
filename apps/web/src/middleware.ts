import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, LOCALES, type Locale } from './i18n/config';
import { canonicalFromSlug, localizedSlug } from './i18n/slugs';

const NON_DEFAULT = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

export function middleware(req: NextRequest): NextResponse {
  // Canonical host is www. Redirect the bare apex to https://www.tiptalk.chat.
  const host = (req.headers.get('host') ?? '').split(':')[0];
  if (host === 'tiptalk.chat') {
    const url = req.nextUrl.clone();
    url.protocol = 'https:';
    url.host = 'www.tiptalk.chat';
    url.port = '';
    return NextResponse.redirect(url, 308);
  }

  const parts = req.nextUrl.pathname.split('/');
  const seg0 = parts[1] ?? '';
  const hasLocale = (NON_DEFAULT as readonly string[]).includes(seg0);
  const locale = (hasLocale ? seg0 : DEFAULT_LOCALE) as Locale;
  const pageIdx = hasLocale ? 2 : 1;
  const pageSeg = parts[pageIdx] ?? '';

  // Localized landing slugs (/it/guadagnare-… → render the canonical route).
  if (pageSeg) {
    const canonical = canonicalFromSlug(pageSeg, locale);
    if (canonical) {
      const want = localizedSlug(canonical, locale);
      // Canonical (Spanish) slug used where a localized one exists → consolidate.
      if (pageSeg === canonical && want !== canonical) {
        parts[pageIdx] = want;
        const r = req.nextUrl.clone();
        r.pathname = parts.join('/') || '/';
        return NextResponse.redirect(r, 308);
      }
      // Localized slug used → rewrite to the canonical route for rendering.
      if (pageSeg !== canonical) {
        parts[pageIdx] = canonical;
      }
    }
  }
  const rewritten = parts.join('/') || '/';

  // A non-default locale prefix (/en, /fr, /pt-br…) → strip it and forward the
  // locale to server components via the x-locale REQUEST header.
  if (hasLocale) {
    const url = req.nextUrl.clone();
    url.pathname = rewritten.slice(seg0.length + 1) || '/';
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-locale', seg0);
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-locale', DEFAULT_LOCALE);
  if (rewritten !== req.nextUrl.pathname) {
    const url = req.nextUrl.clone();
    url.pathname = rewritten;
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
};
