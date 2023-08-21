import Fuse from 'fuse.js';
import { z } from 'zod';
import {
  formatLanguageName,
  formatRuntimeName,
} from '@/utilities/language-names';

export const languageSchema = z.object({
  id: z.string(),
  key: z.string(),
  version: z.string(),
  name: z.string(),
  aliases: z.array(z.string()),
  runtime: z
    .object({
      id: z.string(),
      key: z.string(),
      name: z.string(),
    })
    .optional(),
});

export type Language = z.infer<typeof languageSchema>;

export const pistonRuntimesSchema = z.array(
  z.object({
    language: z.string(),
    version: z.string(),
    runtime: z.string().optional(),
    aliases: z.array(z.string()),
  }),
);

/** Fetch all languages from the Piston API. */
export async function fetchLanguages() {
  const runtimes = await fetch('https://emkc.org/api/v2/piston/runtimes')
    .then((response) => response.json())
    .then((runtimes) => pistonRuntimesSchema.parse(runtimes));

  return runtimes
    .sort((a, b) => a.language.localeCompare(b.language))
    .map(({ runtime, ...data }) => {
      const languageName = formatLanguageName(data.language);
      const runtimeName = runtime && formatRuntimeName(runtime);

      return {
        id: `${runtime ? `${runtime}/` : ''}${data.language}` //
          .replaceAll('.', 'dot'),
        key: data.language,
        name: `${languageName}${runtimeName ? ` (${runtimeName})` : ''}`,
        aliases: data.aliases,
        version: data.version,
        runtime: runtime
          ? {
              id: runtime,
              key: runtime,
              name: runtimeName ?? runtime,
            }
          : undefined,
      } satisfies z.infer<typeof languageSchema>;
    });
}

/** Get a single language by its ID. */
export async function getLanguage(id: string) {
  const languages = await fetchLanguages();
  return languages.find((language) => language.id === id);
}

const PREFERRED_RUNTIMES = new Map([
  ['javascript', 'node'],
  ['typescript', undefined],
]);

/** Find a single language using a resolvable. */
export async function findLanguage(resolvable: string) {
  resolvable = resolvable.toLowerCase().trim();
  if (resolvable === '') return undefined;

  const languages = await fetchLanguages();
  return languages.find((language) => {
    const wasFound = [
      language.id,
      language.key,
      language.name,
      ...language.aliases,
    ].some((value) => value.toLowerCase() === resolvable);

    if (!wasFound) return false;
    if (resolvable !== language.key) return wasFound;

    // By default "javascript" will return "deno" but we prefer "node"
    const runtime = PREFERRED_RUNTIMES.get(language.key);
    if (!runtime) return true;

    return runtime === language.runtime?.key;
  });
}

/** Search all language using a query. */
export async function searchLanguages(query: string) {
  if (query.length === 0) return [];

  const languages = await fetchLanguages();
  const keys = ['id', 'name', 'aliases', 'runtime.id', 'runtime.name'];
  const fuse = new Fuse(languages, { keys, threshold: 0.3 });
  return fuse.search(query).map(({ item }) => item);
}
