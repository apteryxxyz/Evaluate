import { type NextRequest, NextResponse } from 'next/server';
import say from './i18n';

export function middleware(request: NextRequest) {
  let response = NextResponse.next();

  const defaultLocale = say.locales[0]!;
  let pathLocale = fromUrlPathname(request.nextUrl.pathname);
  if (pathLocale && !say.locales.includes(pathLocale)) pathLocale = undefined;
  let cookieLocale = fromRequestCookies(request.cookies);
  if (cookieLocale && !say.locales.includes(cookieLocale))
    cookieLocale = undefined;

  if (pathLocale === defaultLocale) {
    // Redirect /{defaultLocale} to /
    request.nextUrl.pathname = request.nextUrl.pathname //
      .replace(`/${defaultLocale}`, '');
    response = NextResponse.redirect(request.nextUrl);
  }
  //
  else if (!pathLocale && cookieLocale) {
    request.nextUrl.pathname = `/${cookieLocale}${request.nextUrl.pathname}`;

    if (cookieLocale === defaultLocale) {
      // Rewrite / to /{defaultLocale}
      response = NextResponse.rewrite(request.nextUrl);
    } else {
      // Redirect / to /{requestLocale}
      response = NextResponse.redirect(request.nextUrl);
    }
  }
  //
  else if (!pathLocale) {
    request.nextUrl.pathname = `/${defaultLocale}${request.nextUrl.pathname}`;
    response = NextResponse.rewrite(request.nextUrl);
  }

  if (!cookieLocale)
    response.cookies.set(
      'preferred-locale',
      pathLocale ?? defaultLocale, //
      { maxAge: 60 * 60 * 24 * 365, path: '/' },
    );

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_vercel|_next/image|api|favicon.ico|sitemap.xml|manifest.webmanifest|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

const LOCALE = /^(?:[a-zA-Z]{2})(?:-[a-zA-Z]{2})?$/;

function fromUrlPathname(pathname: string, partIndex = 0) {
  const value = pathname.split('/')[partIndex * 2 + 1];
  if (value?.match(LOCALE)) return value;
  return undefined;
}

function fromRequestCookies(
  cookies: NextRequest['cookies'],
  key = 'preferred-locale',
) {
  const value = cookies.get(key)?.value;
  if (value?.match(LOCALE)) return value;
  return undefined;
}
