import { determineLocale, locales } from '@evaluate/translate';
import { type NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  // This middleware handles redirecting to the correct locale

  let response = NextResponse.next();

  const pathname = request.nextUrl.pathname;
  const pathLocale = determineLocale(pathname, false);

  if (pathLocale) {
    let pathWithoutLocale = pathname.slice(pathLocale.length + 1) || '/';
    if (request.nextUrl.search) pathWithoutLocale += request.nextUrl.search;

    if (pathLocale === locales[0]) {
      const newUrl = new URL(pathWithoutLocale, request.url);
      // Redirect /{baseLocale} to /
      response = NextResponse.redirect(newUrl);
    }
  }

  if (!pathLocale) {
    const locale = determineLocale(request);

    let newPath = `/${locale}${pathname}`;
    if (request.nextUrl.search) newPath += request.nextUrl.search;
    const newUrl = new URL(newPath, request.url);

    // Rewrite / to /{locale}
    const method = locale === locales[0] ? 'rewrite' : 'redirect';
    response = NextResponse[method](newUrl);
  }

  // Set the locale cookie
  const newLocale = pathLocale ?? locales[0];
  const oldLocale = request.cookies.get('evaluate.locale')?.value;
  if (newLocale !== oldLocale)
    response.cookies.set('evaluate.locale', pathLocale ?? locales[0], {
      sameSite: 'strict',
      maxAge: 31536000,
    });

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|translate|.*\\..*).*)'],
};
