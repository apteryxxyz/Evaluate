import type { MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import { parse, TYPE } from '@formatjs/icu-messageformat-parser';
import type { Layer, Parameter, Parsed, Translations } from '../types';

/* FROM TRANSLATIONS TO LAYER */

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

/* GENERATE STRUCTURE INTERFACE */

function generateStructureInnerInterface(layer: Layer) {
  const result: string[] = [];

  for (const [key, value] of Object.entries(layer)) {
    if (isParsed(value)) {
      const content = value.value.replace(/\n/g, '\\n');
      const quote = determineQuote(content);
      result.push(`${key}: ${quote}${content}${quote};`);
    } else {
      result.push(`${key}: {`);
      result.push(generateStructureInnerInterface(value));
      result.push(`};`);
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

/* GENERATE FUNCTIONS INTERFACE */

function generateFunctionsInnerInterface(layer: Layer) {
  const result: string[] = [];

  for (const [key, value] of Object.entries(layer)) {
    if (isParsed(value)) {
      if (value.key === '$') continue;
      const documenation = `/** ${value.value.replace(/\n/g, ' ')} */`;
      const signature = generateFunctionSignature(value);
      result.push(`${documenation}\n${key}${signature}`);
    } else if ('$' in value && isParsed(value['$'])) {
      const documenation = `/** ${value['$'].value.replace(/\n/g, ' ')} */`;
      const signature = generateFunctionSignature(value['$']);
      result.push(`${documenation}\n${key}:{\n${signature}`);
      result.push(generateFunctionsInnerInterface(value));
      result.push(`};`);
    } else {
      result.push(`${key}: {`);
      result.push(generateFunctionsInnerInterface(value));
      result.push(`};`);
    }
  }

  return result.join('\n');
}

function generateFunctionSignature(parsed: Parsed) {
  if (parsed.parameters.length === 0) return '(): string';
  const parameters = parsed.parameters
    .map(([key, type]) => `${key}: ${type}`)
    .join(', ');
  return `(arg: { ${parameters} }): string`;
}

export function buildInterfacesFile(layer: Layer) {
  return `
export interface TranslationStructure {
${generateStructureInnerInterface(layer)}
}

export interface TranslationFunctions {
${generateFunctionsInnerInterface(layer)}
}
    `.trim();
}
