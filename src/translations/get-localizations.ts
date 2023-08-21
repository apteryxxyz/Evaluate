import { ContextMenuCommandBuilder } from '@discordjs/builders';
import _ from 'lodash';
import type { Locale } from 'translations';
import { baseLocale, locales } from 'translations';
import { getTranslationFunctions } from 'translations/use';

/** Get all localizations for a given key. */
export function getLocalizations(key: string) {
  return {
    value: (_.get(getTranslationFunctions(baseLocale), key) as () => string)(),
    localizations: locales.reduce(
      (localizations, locale) => {
        const value = (
          _.get(getTranslationFunctions(locale), key) as () => string
        )();
        if (value !== undefined) localizations[locale] = value;
        return localizations;
      },
      {} as Record<Locale, string>,
    ),
  };
}

interface BaseBuilder {
  setName?(name: string): this;
  setNameLocalizations?(localizations: Record<Locale, string>): this;
  setDescription?(description: string): this;
  setDescriptionLocalizations?(localizations: Record<Locale, string>): this;
}

/** Apply localizations to a builder. */
export function applyLocalizations<TBuilder extends BaseBuilder>(
  builder: TBuilder,
  ...keys: [name: string, description: string] | [root: string]
) {
  if (keys.length === 1) keys = [keys[0], `${keys[0]}.description`];

  if (builder.setName && builder.setNameLocalizations) {
    const name = getLocalizations(keys[0]);
    const transformer =
      builder instanceof ContextMenuCommandBuilder
        ? (value: string) => value
        : // Names must be lowercase and not have spaces
          (value: string) => value.toLowerCase().replaceAll(' ', '_');
    builder.setName(transformer(name.value));
    builder.setNameLocalizations(_.mapValues(name.localizations, transformer));
  }

  if (builder.setDescription && builder.setDescriptionLocalizations) {
    const description = getLocalizations(keys[1]);
    builder.setDescription(description.value);
    builder.setDescriptionLocalizations(description.localizations);
  }

  return builder;
}

/** Create a localized choice. */
export function createLocalizedChoice<TValueType = number | string>(
  key: string,
  value: TValueType,
) {
  const name = getLocalizations(key);
  return { name: name.value, name_localizations: name.localizations, value };
}
