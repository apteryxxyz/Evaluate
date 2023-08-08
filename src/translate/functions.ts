import type { APIInteraction } from 'discord-api-types/v10';
import _ from 'lodash';
import type { Locale } from 'translations';
import { baseLocale, locales } from 'translations';
import { useTranslate } from './use';

/**
 * Get all localizations for a given key.
 * @param key The key
 */
export function getLocalizations(key: string) {
  return locales.reduce(
    (localizations, locale) => {
      const t = useTranslate(locale);
      const value = (_.get(t, key) as () => string)();
      if (value !== undefined) localizations[locale] = value;
      return localizations;
    },
    {} as Record<Locale, string>,
  );
}

/**
 * Determine the locale of a given interaction, defaults to the base locale.
 * @param value The interaction
 */
export function determineLocale(value: APIInteraction): Locale {
  const userLocale = value.user?.locale;
  if (locales.includes(userLocale!)) return userLocale as Locale;
  // ? Perhaps should use guild locale as backup? However perfer base locale over guild locale
  return baseLocale;
}
