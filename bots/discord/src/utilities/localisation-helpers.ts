import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { getLocalisationsFor } from '@evaluate/translate';
import _get from 'lodash/get';
import _mapValues from 'lodash/mapValues';

interface BuilderLike {
  setName?(name: string): this;
  setNameLocalizations?(localizations: object): this;
  setDescription?(description: string): this;
  setDescriptionLocalizations?(localizations: object): this;
}

/**
 * Apply localisations to a builder.
 * @param builder the builder to apply localisations to
 * @param _keys the keys to use for localisation
 * @returns the same builder
 */
export function applyLocalisations<TBuilder extends BuilderLike>(
  builder: TBuilder,
  [nameKey, descriptionKey]: [name: string, description: string],
): TBuilder {
  if (builder.setName && builder.setNameLocalizations) {
    const { value, localizations } = getLocalisationsFor(nameKey);
    const transformer =
      builder instanceof ContextMenuCommandBuilder
        ? (value: string) => value
        : // Chat input names must be lowercase and not have spaces
          (value: string) => value.toLowerCase().replaceAll(' ', '_');

    builder.setName(transformer(value));
    builder.setNameLocalizations(_mapValues(localizations, transformer));
  }

  if (builder.setDescription && builder.setDescriptionLocalizations) {
    const { value, localizations } = getLocalisationsFor(descriptionKey);
    builder.setDescription(value);
    builder.setDescriptionLocalizations(localizations);
  }

  return builder;
}
