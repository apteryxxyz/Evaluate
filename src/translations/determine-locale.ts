import type { APIInteraction } from 'discord-api-types/v10';
import type { RequestCookies } from 'next/dist/server/web/spec-extension/cookies';
import type { Locale } from 'translations';
import { baseLocale, locales } from 'translations';
import { getTranslationFunctions } from 'translations/use';
import { getUser } from '@/utilities/interaction/interaction-helpers';

export function getTranslate(
  ...params: [locale: Locale] | Parameters<typeof determineLocale>
) {
  if (params.length === 1 && typeof params[0] === 'string')
    return getTranslationFunctions(params[0]);
  else
    return getTranslationFunctions(
      determineLocale(...(params as Parameters<typeof determineLocale>)),
    );
}

/**
 * Determine the locale from a pathname.
 * @param pathname The pathname to check
 */
export function determineLocale(pathname: string): Locale | undefined;

/**
 * Determine the locale from a request, using multiple different methods.
 * @param pathname
 * @param headers
 * @param cookies
 * @platform next
 */
export function determineLocale(
  pathname: string,
  headers: Headers,
  cookies: RequestCookies,
): Locale;

/**
 * Determine the locale from a Discord interaction.
 * @param interaction The interaction to check
 * @platform discord
 */
export function determineLocale(interaction: APIInteraction): Locale;

export function determineLocale(
  ...params:
    | [pathname: string]
    | [interaction: APIInteraction]
    | [pathname: string, headers: Headers, cookies: RequestCookies]
) {
  let locale;

  if (typeof params[0] === 'string') {
    if (params.length === 1) {
      const [pathname] = params;
      const pathLocale = pathname.split('/')[1];
      if (locales.includes(pathLocale)) return pathLocale as Locale;
      return undefined;
    } else {
      const [pathname, headers, cookies] = params;

      // Use route prefix
      if (pathname) {
        const pathLocale = pathname.split('/')[1];
        if (locales.includes(pathLocale)) locale = pathLocale;
      }

      // Use existing cookie
      if (!locale && cookies) {
        if (cookies.has('next-locale')) {
          const value = cookies.get('next-locale')!.value;
          if (locales.includes(value)) locale = value;
        }
      }

      // Use the `accept-language` header
      if (!locale && headers) {
        if (headers.has('accept-language')) {
          const value = headers.get('accept-language')!;
          const languages = value.split(/,|;/).map((l) => l.trim());
          for (const language of languages) {
            if (locales.includes(language)) {
              locale = language;
              break;
            }
          }
        }
      }
    }
  } else {
    const [interaction] = params;

    // Use the user locale
    const userLocale =
      getUser(interaction)?.locale ??
      (Reflect.get(interaction, 'locale') as string);
    if (locales.includes(userLocale)) return userLocale as Locale;
  }

  // Use default locale
  if (!locale) locale = baseLocale;

  return locale;
}
