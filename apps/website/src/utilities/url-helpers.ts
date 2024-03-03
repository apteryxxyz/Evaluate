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
  removeExisting = true,
): T {
  if (typeof url === 'object') {
    url.pathname = addLocale(url.pathname ?? '/', locale);
    return url;
  }

  const cleanedUrl = String(removeLocale(url));

  if (!cleanedUrl.startsWith('http') && !cleanedUrl.startsWith('/'))
    throw new Error(`Invalid url: ${cleanedUrl}`);
  if (removeExisting && locale === locales[0]) return cleanedUrl as T;
  if (cleanedUrl.startsWith('/')) return `/${locale}${cleanedUrl}` as T;

  return addLocale(new URL(cleanedUrl), locale).toString() as T;
}

/**
 * Remove the locale from a URL.
 * @param url the URL to remove the locale from
 * @returns the new URL
 * @throws if the URL is invalid
 */
export function removeLocale<T extends URL | UrlObject | string>(url: T): T {
  if (typeof url === 'object') {
    url.pathname = removeLocale(url.pathname ?? '/');
    return url;
  }

  if (!url.startsWith('http') && !url.startsWith('/'))
    throw new Error(`Invalid url: ${url}`);
  if (url.startsWith('/')) return removeLocaleFromPathname(url) as T;

  return removeLocale(new URL(url)).toString() as T;
}

function removeLocaleFromPathname(pathname: string) {
  const locale = locales.find((l) => pathname.startsWith(`/${l}`));
  return locale ? pathname.replace(`/${locale}`, '') || '/' : pathname;
}

/**
 * Get the absolute URL for a path.
 * @param path the path to get the absolute URL for
 * @returns the absolute URL
 */
export function absoluteUrl<S extends `${'http' | '/'}${string}`>(path?: S) {
  return new URL(path ?? '/', process.env.NEXT_PUBLIC_WEBSITE_URL).toString();
}
