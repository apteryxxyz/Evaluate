import type { UrlObject } from 'url';
import type { Locale } from 'translations';
import { locales } from 'translations';

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

export function absoluteUrl(path = '/') {
  return new URL(path, process.env.NEXT_PUBLIC_APP_URL).toString();
}

export function getPathname(path: string) {
  const locale = locales.find((locale) => path.startsWith(`/${locale}`));
  return locale ? path.replace(`/${locale}`, '') : path;
}

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
