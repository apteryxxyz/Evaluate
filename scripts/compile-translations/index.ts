import { exec } from 'node:child_process';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import _ from 'lodash';
import { buildIndexDtsFile, buildIndexJsFile } from './builders';
import {
  buildInterfacesFile,
  fromTranslationsToLayer,
} from './builders/interfaces';
import type { Translations } from './types';

const execAsync = promisify(exec);

void main(process.argv.length, process.argv);
async function main(_argc: number, _argv: string[]) {
  const { stdout: branch } = await execAsync('git rev-parse --abbrev-ref HEAD');
  if (branch.trim() !== 'main') throw new Error('Not on main branch');

  const baseLocale = 'en-GB';
  const rootPath = process.cwd();
  const saveDir = join(rootPath, '.translations');

  const locales = readdirSync(join(rootPath, 'locales'));
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
    const localeFile = join(saveDir, `${locale}.json`);
    const localeTranslations = loadLocaleTranslations(locale);
    const allTranslations = _.merge(localeTranslations, translations);
    const localeContent = JSON.stringify(allTranslations, null, 2);
    writeFileSync(localeFile, localeContent);
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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const data = require(path) as unknown;
    translations[key] = data;
  }

  return translations as Translations;
}
