import { readFile, readdir as listDirectory } from 'node:fs/promises';
import { join } from 'node:path';
import _mergeWith from 'lodash/mergeWith';
import { UnparsedTranslations } from '../types';

export async function readTranslations(locale: string) {
  const localePath = join(process.cwd(), 'dictionaries', locale);
  const localeFiles = await listDirectory(localePath);

  let translations: UnparsedTranslations = {};
  for (const localeFile of localeFiles) {
    const filePath = join(localePath, localeFile);
    const fileContents = await readFile(filePath, 'utf8');
    const fileTranslations = JSON.parse(fileContents) as UnparsedTranslations;
    translations = _mergeWith(translations, fileTranslations, (left, right) => {
      if (typeof left === 'string' && typeof right === 'object') {
        return { $: left, ...right };
      } else if (typeof left === 'object' && typeof right === 'string') {
        return { ...left, $: right };
      }
    });
  }

  return translations;
}
