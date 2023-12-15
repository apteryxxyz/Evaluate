import type { Translation, Translations } from '../types';

function generateFunctionsInnerInterface(translations: Translations) {
  const result: string[] = [];

  for (const [key, value] of Object.entries(translations)) {
    if (isTranslation(value)) {
      const documentation = `/** ${value.value.replace(/\n/g, ' ')} */`;
      const signature = generateFunctionSignature(value);
      result.push(`${documentation}\n${key}${signature}`);
    } else if ('$' in value && isTranslation(value.$)) {
      const documentation = `/** ${value.$.value.replace(/\n/g, ' ')} */`;
      const signature = generateFunctionSignature(value.$);
      result.push(`${documentation}\n${key}:{\n${signature}`);
      result.push(generateFunctionsInnerInterface(value));
      result.push('};');
    } else {
      result.push(`${key}: {`);
      result.push(generateFunctionsInnerInterface(value));
      result.push('};');
    }
  }

  return result.join('\n');
}

function generateFunctionSignature(translation: Translation) {
  if (translation.parameters.length === 0) return '(): string';
  const parameters = translation.parameters
    .filter(([key], i, s) => s.findIndex(([k]) => k === key) === i)
    .map(([key, type]) => `${key}: ${type}`)
    .join(', ');
  return `(arg: { ${parameters} }): string`;
}

export function buildInterfacesFile(translations: Translations) {
  return `
// This file is generated automatically, any changes will be overwritten

export interface TranslateFunctions {
  ${generateFunctionsInnerInterface(translations)}
}

  `.trim();
}

function isTranslation(value: unknown): value is Translation {
  return typeof value === 'object' && value !== null && 'parameters' in value;
}
