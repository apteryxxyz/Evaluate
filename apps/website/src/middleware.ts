import { determineLocale, locales } from '@evaluate/translate';
import { NextRequest, NextResponse } from 'next/server';

/*
export default function middleware(request: NextRequest) {
  let response = NextResponse.next();

  const pathname = request.nextUrl.pathname;
  const pathLocale = determinePathnameLocale(pathname);

  if (pathLocale) {
    if (pathLocale === locales[0]) {
      let pathWithoutLocale = pathname.slice(pathLocale.length + 1) || '/';
      if (request.nextUrl.search) pathWithoutLocale += request.nextUrl.search;

      const newUrl = new URL(pathWithoutLocale, request.url);
      // Redirect /{baseLocale} to /
      response = NextResponse.redirect(newUrl.toString());
    }
  } else {
    const requestLocale = determineNextRequestLocale(request);

    if (!requestLocale.some(l => locales.includes(l as never))) {
      const newUrl = new URL(`/${locales[0]}${pathname}`, request.url);
      return NextResponse.redirect(newUrl.toString());
    }

    // let pathWithLocale = `/${requestLocale}${pathname}`;
    // if (request.nextUrl.search) pathWithLocale += request.nextUrl.search;

    // const newUrl = new URL(pathWithLocale, request.url);
    // // Rewrite / to /{locale}
    // const method = requestLocale === locales[0] ? 'rewrite' : 'redirect';
    // response = NextResponse[method](newUrl);
  }

  // Set the locale cookie
  const newLocale = pathLocale ?? locales[0];
  const oldLocale = request.cookies.get('evaluate.locale')?.value;
  if (newLocale !== oldLocale) {
    response.cookies.set('evaluate.locale', newLocale, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
  }

  return response;
}
*/

export default function middleware(request: NextRequest) {
  let response = NextResponse.next();

  const defaultLocale = locales[0];
  const pathname = request.nextUrl.pathname;
  const pathLocale = determineLocale(pathname, false);

  if (pathLocale === defaultLocale) {
    // Redirect /{defaultLocale} to /

    let pathWithoutLocale = pathname.slice(pathLocale.length + 1) || '/';
    if (request.nextUrl.search) pathWithoutLocale += request.nextUrl.search;

    const newUrl = new URL(pathWithoutLocale, request.url);
    response = NextResponse.redirect(newUrl.toString());
  }

  if (!pathLocale) {
    const requestLocale = determineLocale(request);

    let pathWithLocale = `/${requestLocale}${pathname}`;
    if (request.nextUrl.search) pathWithLocale += request.nextUrl.search;
    const newUrl = new URL(pathWithLocale, request.url);

    if (requestLocale === defaultLocale) {
      // Rewrite / to /{defaultLocale}
      response = NextResponse.rewrite(newUrl.toString());
    } else {
      // Redirect / to /{locale}
      response = NextResponse.redirect(newUrl.toString());
    }
  }

  // Set the locale cookie
  const newLocale = pathLocale ?? locales[0];
  response.cookies.set('evaluate.locale', newLocale, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });

  return response;
}

export const config = {
  matcher: ['/((?!api|_?_next|.*\\..*).*)'],
};
