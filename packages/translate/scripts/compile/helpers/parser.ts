import {
  Parameter,
  Translation,
  Translations,
  UnparsedTranslations,
} from '../types';
import {
  parse,
  type MessageFormatElement,
  TYPE,
} from '@formatjs/icu-messageformat-parser';

/**
 * Parse a raw translation object into a fully parsed translation object.
 * @param unparsed the raw translation object
 * @returns the fully parsed translation object
 */
export function parseTranslations(unparsed: UnparsedTranslations) {
  const parsed: Translations = {};

  for (const [key, value] of Object.entries(unparsed)) {
    if (typeof value === 'object') {
      const parsedValue = parseTranslations(value);
      if (Object.keys(parsedValue).length > 0) parsed[key] = parsedValue;
    }

    if (typeof value === 'string') {
      if (key.startsWith('#')) continue;
      const parsedValue = parseTranslationString(key, value);
      parsed[key] = parsedValue;
    }
  }

  return parsed;
}

/**
 * Parses a translation string into a Translation object.
 * @param key the translation key
 * @param value the translation string
 * @returns the parsed Translation object
 */
function parseTranslationString(key: string, value: string): Translation {
  const elements = parse(value);
  const parameters = elements
    .map(convertFormatElementToParameter)
    .filter((p): p is Parameter => p !== null);
  return { key, value, parameters };
}

/**
 * Converts a MessageFormatElement to a Parameter tuple.
 * @param element the MessageFormatElement to convert
 * @returns the converted Parameter tuple or null if the element
 * is not a valid parameter
 */
function convertFormatElementToParameter(
  element: MessageFormatElement,
): Parameter | null {
  const key = ('value' in element && element.value) || '';

  if (element.type === TYPE.argument) return [key, 'string'];
  if (element.type === TYPE.date) return [key, 'Date'];
  if (element.type === TYPE.number || element.type === TYPE.plural)
    return [key, 'number'];

  if (element.type === TYPE.select) {
    const keys = Object.keys(element.options).map((key) => `'${key}'`);
    if (keys.length === 1) return null;
    return [key, keys.join(' | ') as `${string} | ${string}`];
  }

  return null;
}
