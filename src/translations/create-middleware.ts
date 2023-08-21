import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { determineLocale } from './determine-locale';

/** Create a middleware to redirect to the correct locale. */
export function createMiddleware() {
  return function middleware(request: NextRequest) {
    const locale = determineLocale(
      request.nextUrl.pathname,
      request.headers,
      request.cookies,
    );

    const init = { request: { headers: request.headers } };
    const redirect = (url: string) =>
      NextResponse.redirect(new URL(url, request.url));
    const next = () => NextResponse.next(init);

    let response = next();
    if (request.nextUrl.pathname === '/') {
      // Redirect the root to the determined locale
      let pathWithLocale = `/${locale}`;
      if (request.nextUrl.search) pathWithLocale += request.nextUrl.search;
      response = redirect(pathWithLocale);
    } else if (!determineLocale(request.nextUrl.pathname)) {
      // If the path doesn't contain a locale, redirect to the determined locale
      let pathWithLocale = `/${locale}${request.nextUrl.pathname}`;
      if (request.nextUrl.search) pathWithLocale += request.nextUrl.search;
      response = redirect(pathWithLocale);
    }

    // Set the locale cookie if it doesn't exist or is different
    if (request.cookies.get('next-locale')?.value !== locale)
      response.cookies.set('next-locale', locale, {
        sameSite: 'strict',
        maxAge: 31536000,
      });

    return response;
  };
}
