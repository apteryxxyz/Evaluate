import type { UrlObject } from 'url';
import type { Locale } from 'translations';
import { locales } from 'translations';

/** Add a locale to a URL. */
export function addLocale<T extends URL | UrlObject | string>(
  url: T,
  locale: Locale,
): T {
  if (url instanceof URL) {
    url.pathname = `/${locale}${url.pathname}`;
    return url;
  } else if (typeof url === 'object') {
    url.pathname = `/${locale}${url.pathname}`;
    return url;
  } else if (typeof url === 'string') {
    if (url.startsWith('/')) return `/${locale}${url}` as T;
    const obj = new URL(url);
    obj.pathname = `/${locale}${obj.pathname}`;
    return obj.toString() as T;
  }

  throw new Error('Invalid URL');
}

/** Remove a locale from a URL. */
export function removeLocale<T extends URL | UrlObject | string>(url: T): T {
  if (url instanceof URL) {
    url.pathname = removeLocaleFromPathname(url.pathname);
    return url;
  } else if (typeof url === 'object') {
    if (url.pathname) url.pathname = removeLocaleFromPathname(url.pathname);
    return url;
  } else if (typeof url === 'string') {
    if (url.startsWith('/')) return removeLocaleFromPathname(url) as T;
    const obj = new URL(url);
    obj.pathname = removeLocaleFromPathname(obj.pathname);
    return obj.toString() as T;
  }

  throw new Error('Invalid URL');
}

function removeLocaleFromPathname(pathname: string) {
  const locale = locales.find((locale) => pathname.startsWith(`/${locale}`));
  return locale ? pathname.replace(`/${locale}`, '') : pathname;
}

/** Remove a locale from a URL. */
export function absoluteUrl(path = '/') {
  return new URL(path, process.env.NEXT_PUBLIC_APP_URL).toString();
}

/** Proxy an image URL before WSRV. */
export function proxyImageUrl(
  url: string | URL,
  quality = 80,
  width?: number,
  height = width,
) {
  const proxifiedUrl = new URL('https://wsrv.nl');

  proxifiedUrl.searchParams.set('url', url.toString());
  proxifiedUrl.searchParams.set('quality', quality.toString());

  if (width) proxifiedUrl.searchParams.set('w', width.toString());
  if (height) proxifiedUrl.searchParams.set('h', height.toString());

  return proxifiedUrl.toString();
}
