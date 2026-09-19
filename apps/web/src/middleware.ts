import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, LOCALES } from './i18n/config';

const NON_DEFAULT = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;
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
