/* eslint-disable @typescript-eslint/no-var-requires */
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildIndexDtsFile, buildIndexJsFile } from './builders';
import {
  buildInterfacesFile,
  fromTranslationsToLayer,
} from './builders/interfaces';
import type { Translations } from './types';

void main();
function main() {
  const baseLocale = 'en-GB';
  const rootPath = process.cwd();
  const saveDir = join(rootPath, '.translations');

  const locales = readdirSync(join(rootPath, 'locales')) //
    .filter((file) => file !== 'source');
  if (!locales.includes(baseLocale)) throw new Error('Base locale not found');

  const translations = loadLocaleTranslations(baseLocale);
  const layer = fromTranslationsToLayer(translations);

  try {
    readdirSync(saveDir);
  } catch {
    console.info('Creating .translations directory...');
    mkdirSync(saveDir, { recursive: true });
  }

  for (const locale of locales) {
    console.info(`Saving full ${locale} translation file...`);
    const translationsFile = join(saveDir, `${locale}.json`);
    const translations = loadLocaleTranslations(locale);
    const translationsContent = JSON.stringify(translations, null, 2);
    writeFileSync(translationsFile, translationsContent);
  }

  console.info('Saving interfaces file...');
  const interfacesFile = join(saveDir, 'interfaces.d.ts');
  const interfacesContent = buildInterfacesFile(layer);
  writeFileSync(interfacesFile, interfacesContent);

  console.info('Saving index file...');
  const constantsJsFile = join(saveDir, 'index.js');
  const constantsJsContent = buildIndexJsFile(baseLocale, locales);
  writeFileSync(constantsJsFile, constantsJsContent);
  const constantsDtsFile = join(saveDir, 'index.d.ts');
  const constantsDtsContent = buildIndexDtsFile(baseLocale, locales);
  writeFileSync(constantsDtsFile, constantsDtsContent);
}

function loadLocaleTranslations(locale: string) {
  const directory = join(process.cwd(), 'locales', locale);
  const files = readdirSync(directory)
    .filter((file) => file.endsWith('.json'))
    .map((file) => [join(directory, file), file.slice(0, -5)] as const);

  const translations: Record<string, unknown> = {};
  for (const [path, key] of files) {
    const data = require(path) as unknown;
    translations[key] = data;
  }

  return translations as Translations;
}
