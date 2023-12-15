import type { UrlObject } from 'node:url';
import { Locale, locales } from '@evaluate/translate';

/**
 * Add a locale to a URL.
 * @param url the URL to add the locale to
 * @param locale the locale to add
 * @returns the new URL
 * @throws if the URL is invalid
 */
export function addLocale<T extends URL | UrlObject | string>(
  url: T,
  locale: Locale,
): T {
  if (typeof url === 'object') {
    url.pathname = `/${locale}/${url.pathname}`;
    return url;
  }

  if (typeof url === 'string') {
    if (!url.startsWith('http') && !url.startsWith('/'))
      throw new Error(`Invalid url: ${url}`);
    // if (locale === locales[0]) return url;

    if (url.startsWith('/')) return `/${locale}${url}` as T;
    return addLocale(new URL(url), locale).toString() as T;
  }

  throw new Error(`Invalid url: ${url}`);
}

/**
 * Remove the locale from a URL.
 * @param url the URL to remove the locale from
 * @returns the new URL
 * @throws if the URL is invalid
 */
export function removeLocale<T extends URL | UrlObject | string>(url: T): T {
  if (typeof url === 'object') {
    if (url.pathname) url.pathname = removeLocaleFromPathname(url.pathname);
    return url;
  }

  if (typeof url === 'string') {
    if (!url.startsWith('http') && !url.startsWith('/'))
      throw new Error(`Invalid url: ${url}`);

    if (url.startsWith('/')) return removeLocaleFromPathname(url) as T;
    return removeLocale(new URL(url)).toString() as T;
  }

  throw new Error(`Invalid url: ${url}`);
}

function removeLocaleFromPathname(pathname: string) {
  const locale = locales.find((locale) => pathname.startsWith(`/${locale}`));
  return locale ? pathname.replace(`/${locale}`, '') || '/' : pathname;
}

/**
 * Get the absolute URL for a path.
 * @param path the path to get the absolute URL for
 * @returns the absolute URL
 */
export function absoluteUrl(path = '/') {
  return new URL(path, process.env.NEXT_PUBLIC_WEBSITE_URL).toString();
}
