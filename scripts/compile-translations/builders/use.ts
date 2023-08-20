export function buildUseJsFile(baseLocale: string, locales: string[]) {
  return `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const IntlMessageFormat = require('intl-messageformat').default;
${locales
  .map(
    (locale) => `const ${locale.replace('-', '_')} = require('./${locale}');`,
  )
  .join('\n')}

function getTranslationStructure(locale) {
  switch (locale) {
    ${locales
      .map((locale) => `case '${locale}': return ${locale.replace('-', '_')};`)
      .join('\n    ')}
    default: return ${baseLocale.replace('-', '_')};
  }
}

function wrapTarget(target, fn) {
  if (typeof target === 'string') return fn.bind(null, target);
  return Object.assign(
    Object.defineProperty(() => target.$, 'name', { writable: true }),
    target,
  );
}

function createProxy(target, fn) {
  return new Proxy(
    wrapTarget(target, fn),
    { get: (target, key) => createProxy(target[key], fn) }
  );
}

function getTranslationFunctions(locale) {
  return createProxy(
    getTranslationStructure(locale),
    (text, args) => {
      if (!text.includes('{')) return text;
      const message = new IntlMessageFormat(text, locale);
      return message.format(args);
    }
  );
}

exports.getTranslationStructure = getTranslationStructure;
exports.getTranslationFunctions = getTranslationFunctions;
  `.trim();
}

export function buildUseDtsFile() {
  return `
import type { Locale } from './index';
import type { TranslationFunctions, TranslationStructure } from './interfaces';
export declare function getTranslationStructure(locale: Locale): TranslationStructure;
export declare function getTranslationFunctions(locale: Locale): TranslationFunctions;
  `.trim();
}
