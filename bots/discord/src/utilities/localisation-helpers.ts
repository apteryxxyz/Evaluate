import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { type Locale, getLocalisationsFor } from '@evaluate/translate';
import _get from 'lodash/get';
import _mapValues from 'lodash/mapValues';

interface BuilderLike {
  setName?(name: string): this;
  setNameLocalizations?(localizations: Record<Locale, string>): this;
  setDescription?(description: string): this;
  setDescriptionLocalizations?(localizations: Record<Locale, string>): this;
}

/**
 * Apply localisations to a builder.
 * @param builder the builder to apply localisations to
 * @param _keys the keys to use for localisation
 * @returns the same builder
 */
export function applyLocalisations<TBuilder extends BuilderLike>(
  builder: TBuilder,
  ..._keys: [name: string, description: string] | [root: string]
) {
  const keys: [string, string] =
    _keys.length === 1 ? [_keys[0], `${_keys[0]}.description`] : _keys;

  if (builder.setName && builder.setNameLocalizations) {
    const { value, localizations } = getLocalisationsFor(keys[0]);
    const transformer =
      builder instanceof ContextMenuCommandBuilder
        ? (value: string) => value
        : // Chat input names must be lowercase and not have spaces
          (value: string) => value.toLowerCase().replaceAll(' ', '_');

    builder.setName(transformer(value));
    builder.setNameLocalizations(_mapValues(localizations, transformer));
  }

  if (builder.setDescription && builder.setDescriptionLocalizations) {
    const { value, localizations } = getLocalisationsFor(keys[1]);
    builder.setDescription(value);
    builder.setDescriptionLocalizations(localizations);
  }

  return builder;
}
