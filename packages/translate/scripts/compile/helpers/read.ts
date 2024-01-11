import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { UnparsedTranslations } from '../types';

export async function readTranslations(locale: string) {
  const filePath = join(process.cwd(), 'dictionaries', `${locale}.json`);
  const fileContents = await readFile(filePath, 'utf8');
  return JSON.parse(fileContents) as UnparsedTranslations;
}
