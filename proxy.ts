import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { localeFromPath } from '@/lib/i18n';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', localeFromPath(pathname));
  requestHeaders.set('x-pathname', pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/((?!api|_next|_models|.*\\..*).*)'],
};
