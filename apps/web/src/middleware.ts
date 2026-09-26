import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, LOCALES } from './i18n/config';

const NON_DEFAULT = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  // Canonical host is www. Redirect the bare apex (tiptalk.chat) to
  // https://www.tiptalk.chat. This only fires once the apex actually reaches
  // this app (i.e. after its DNS points at Railway); until then it is inert.
  const host = (req.headers.get('host') ?? '').split(':')[0];
  if (host === 'tiptalk.chat') {
    const url = req.nextUrl.clone();
    url.protocol = 'https:';
    url.host = 'www.tiptalk.chat';
    url.port = '';
    return NextResponse.redirect(url, 308);
  }

  const seg = pathname.split('/')[1] ?? '';

  // A non-default locale prefix (/en, /fr, /pt-br…) → rewrite to the
  // underlying route and forward the locale to server components via a
  // REQUEST header (readable with headers()).
  if ((NON_DEFAULT as readonly string[]).includes(seg)) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(seg.length + 1) || '/';
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-locale', seg);
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-locale', DEFAULT_LOCALE);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
};
