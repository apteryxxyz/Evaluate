import '@total-typescript/ts-reset';
import type { MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import { parse, TYPE } from '@formatjs/icu-messageformat-parser';
import type { Layer, Parameter, Parsed, Translations } from '../types';

// FROM TRANSLATIONS TO LAYER

export function fromTranslationsToLayer(translations: Translations) {
  const result: Layer = {};

  for (const [key, value] of Object.entries(translations)) {
    if (typeof value === 'object') {
      const parsed = fromTranslationsToLayer(value);
      if (Object.keys(parsed).length) result[key] = parsed;
    }

    if (typeof value === 'string') {
      if (key.startsWith('#')) continue;
      result[key] = fromStringToParsed(key, value);
    }
  }

  return result;
}

function fromStringToParsed(key: string, value: string): Parsed {
  const messages = parse(value);
  const parameters = messages.map(fromMessageToParameter).filter(Boolean);
  return { key, value, parameters };
}

function fromMessageToParameter(
  message: MessageFormatElement,
): Parameter | null {
  const key = ('value' in message && message.value) || '';

  if (message.type === TYPE.argument) return [key, 'string'];
  if (message.type === TYPE.date) return [key, 'Date'];
  if (message.type === TYPE.number || message.type === TYPE.plural)
    return [key, 'number'];

  if (message.type === TYPE.select) {
    const keys = Object.keys(message.options).map((key) => `'${key}'`);
    if (keys.length === 1) return null;
    return [key, keys.join(' | ') as `${string} | ${string}`];
  }

  return null;
}

// GENERATE STRUCTURE INTERFACE

function generateStructureInnerInterface(layer: Layer, indent = 0) {
  const result: string[] = [];
  const space = ' '.repeat(indent);

  for (const [key, value] of Object.entries(layer)) {
    if (isParsed(value)) {
      const content = value.value.replace(/\n/g, '\\n');
      const quote = determineQuote(content);
      result.push(`${space}${key}: ${quote}${content}${quote};`);
    } else {
      result.push(`${space}${key}: {`);
      result.push(generateStructureInnerInterface(value, indent + 2));
      result.push(`${space}};`);
    }
  }

  return result.join('\n');
}

function isParsed(value: unknown): value is Parsed {
  return typeof value === 'object' && value !== null && 'parameters' in value;
}

function determineQuote(value: string) {
  if (!value.includes("'")) return "'";
  if (!value.includes('"')) return '"';
  if (!value.includes('`')) return '`';
  throw new Error('Unable to determine quote');
}

// GENERATE FUNCTIONS INTERFACE

function generateFunctionsInnerInterface(layer: Layer, indent = 0) {
  const result: string[] = [];
  const space = ' '.repeat(indent);

  for (const [key, value] of Object.entries(layer)) {
    if (isParsed(value)) {
      result.push(generateFunctionType(value, indent));
    } else {
      result.push(`${space}${key}: {`);
      result.push(generateFunctionsInnerInterface(value, indent + 2));
      result.push(`${space}};`);
    }
  }

  return result.join('\n');
}

function generateFunctionType(parsed: Parsed, indent = 0) {
  const space = ' '.repeat(indent);
  const jsDoc = `${space}/** ${parsed.value.replace(/\n/g, ' ')} */`;

  if (parsed.parameters.length === 0)
    return `${jsDoc}\n${space}${parsed.key}(): string;`;

  const parameters = parsed.parameters
    .map(([key, type]) => `${key}: ${type}`)
    .join(', ');

  return `${jsDoc}\n${space}${parsed.key}(arg: { ${parameters} }): string;`;
}

export function buildInterfacesFile(layer: Layer) {
  return `
export interface TranslationStructure {
${generateStructureInnerInterface(layer, 2)}
}

export interface TranslationFunctions {
${generateFunctionsInnerInterface(layer, 2)}
}
    `.trim();
}
