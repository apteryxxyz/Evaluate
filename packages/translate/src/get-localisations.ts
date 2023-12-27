import { Locale, getTranslate, locales } from '.';

/**
 * Get the localisations for a given key.
 * @param key the key to get the localisations for
 * @returns a localisation map
 */
export function getLocalisationsFor(key: string) {
  const [baseLocale, ...restLocales] = locales;

  const base = simpleGet(getTranslate(baseLocale!), key)();
  const localisations = restLocales.reduce(
    (localisations, locale) => {
      const value = simpleGet(getTranslate(locale), key)();
      if (value) localisations[locale] = value;
      return localisations;
    },
    {} as Record<Locale, string>,
  );

  return { value: base, localisations, localizations: localisations };
}

// The getLocalisationsFor function is used on the edge, and
// lodash is not available there
// biome-ignore lint/suspicious/noExplicitAny: any is required here
function simpleGet(obj: any, path: string) {
  const [key, ...rest] = path.split('.');
  if (!key) return obj;
  return simpleGet(obj[key], rest.join('.'));
}
