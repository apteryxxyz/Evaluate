export function buildIndexJsFile(
  baseLocale: string,
  locales: string[],
  nativeNames: string[],
) {
  return `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.baseLocale = '${baseLocale}';
exports.locales = ['${locales.join("', '")}'];
exports.languages = {
  ${locales.map((l, i) => `'${l}': '${nativeNames[i]}'`).join(',\n  ')}
};
  `.trim();
}

export function buildIndexDtsFile(baseLocale: string, locales: string[]) {
  return `
export * from './interfaces';
export declare const baseLocale: '${baseLocale}';
export type BaseLocale = typeof baseLocale;
export declare const locales: readonly ['${locales.join("', '")}'];
export type Locale = (typeof locales)[number];
export declare const languages: Record<Locale, string>;
  `.trim();
}
