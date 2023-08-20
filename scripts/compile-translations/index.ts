import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import _ from 'lodash';
import { buildIndexDtsFile, buildIndexJsFile } from './builders';
import {
  buildInterfacesFile,
  fromTranslationsToLayer,
} from './builders/interfaces';
import { buildUseDtsFile, buildUseJsFile } from './builders/use';
import type { Translations } from './types';

void main(process.argv.length, process.argv);
async function main(_argc: number, _argv: string[]) {
  const baseLocale = 'en-GB';
  const rootPath = process.cwd();
  const saveDir = join(rootPath, '.translations');

  const locales = await readdir(join(rootPath, 'locales'));
  if (!locales.includes(baseLocale)) throw new Error('Base locale not found');

  const baseTranslations = await loadLocaleTranslation(baseLocale);
  const baseLayer = fromTranslationsToLayer(baseTranslations);

  try {
    await readdir(saveDir);
  } catch {
    console.info('Creating .translations directory...');
    await mkdir(saveDir, { recursive: true });
  }

  const nativeNames = [];
  for (const locale of locales) {
    console.info(`Saving full ${locale} translation file...`);
    const localeFile = join(saveDir, `${locale}.json`);
    const localeTranslations = await loadLocaleTranslation(locale);
    nativeNames.push(String(localeTranslations['native_name']));
    const allTranslations = _.merge(baseTranslations, localeTranslations);
    const localeContent = JSON.stringify(allTranslations, null, 2);
    await writeFile(localeFile, localeContent);
  }

  console.info('Saving interfaces file...');
  const interfacesFile = join(saveDir, 'interfaces.d.ts');
  const interfacesContent = buildInterfacesFile(baseLayer);
  await writeFile(interfacesFile, interfacesContent);

  console.info('Saving use file...');
  const useJsFile = join(saveDir, 'use.js');
  const useJsContent = buildUseJsFile(baseLocale, locales);
  await writeFile(useJsFile, useJsContent);
  const useDtsFile = join(saveDir, 'use.d.ts');
  const useDtsContent = buildUseDtsFile();
  await writeFile(useDtsFile, useDtsContent);

  console.info('Saving index file...');
  const constantsJsFile = join(saveDir, 'index.js');
  const constantsJsContent = buildIndexJsFile(baseLocale, locales, nativeNames);
  await writeFile(constantsJsFile, constantsJsContent);
  const constantsDtsFile = join(saveDir, 'index.d.ts');
  const constantsDtsContent = buildIndexDtsFile(baseLocale, locales);
  await writeFile(constantsDtsFile, constantsDtsContent);
}

async function loadLocaleTranslation(locale: string) {
  const filePath = join(process.cwd(), 'locales', `${locale}/common.json`);
  const fileContents = await readFile(filePath, 'utf8');
  return JSON.parse(fileContents) as Translations;
}
