import { readdir as listDirectory, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import _merge from 'lodash/merge';
import { buildGetFile } from './builders/get';
import { buildInterfacesFile } from './builders/interfaces';
import { buildLocalesFile } from './builders/locales';
import { parseTranslations } from './helpers/parser';
import { readTranslations } from './helpers/read';

void main(process.argv.length, process.argv);
async function main(_argc: number, _argv: string[]) {
  const rootPath = process.cwd();
  const saveDirectory = join(rootPath, 'src/generated');

  const baseLocaleKey = 'en';
  const localeKeys = await listDirectory(join(rootPath, 'dictionaries'));
  if (!localeKeys.includes(baseLocaleKey))
    throw new Error(`Base locale '${baseLocaleKey}' not found`);

  const baseUnparsedTranslations = await readTranslations(baseLocaleKey);
  const baseParsedTranslations = parseTranslations(baseUnparsedTranslations);

  const locales: Record<string, string> = {};
  for (const localeKey of Array.from(new Set([baseLocaleKey, ...localeKeys]))) {
    const localeUnparsedTranslations = await readTranslations(localeKey);
    if (!localeUnparsedTranslations.native_name) continue;
    locales[localeKey] = String(localeUnparsedTranslations.native_name);

    await writeFile(
      join(saveDirectory, `${localeKey}.json`),
      JSON.stringify(localeUnparsedTranslations, null, 2),
    );
  }

  console.info('Saving interfaces file...');
  const interfacesFilePath = join(saveDirectory, 'interfaces.ts');
  const interfacesFileContents = buildInterfacesFile(baseParsedTranslations);
  await writeFile(interfacesFilePath, interfacesFileContents);

  console.info('Saving get file...');
  const useFilePath = join(saveDirectory, 'get.ts');
  const useFileContents = buildGetFile(locales);
  await writeFile(useFilePath, useFileContents);

  console.info('Saving locales file...');
  const localesFilePath = join(saveDirectory, 'locales.ts');
  const localesFileContents = buildLocalesFile(locales);
  await writeFile(localesFilePath, localesFileContents);
}
