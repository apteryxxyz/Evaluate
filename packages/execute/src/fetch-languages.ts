import Fuse from 'fuse.js';
import { z } from 'zod';
import { resolveLanguageName, resolveRuntimeName } from './constants/index';

export type Language = z.infer<typeof LanguageSchema>;
export const LanguageSchema = z.object({
  id: z.string(),
  key: z.string(),
  version: z.string(),
  short: z.string(),
  name: z.string(),
  aliases: z.array(z.string()).optional(),
  runtime: z
    .object({
      id: z.string(),
      key: z.string(),
      name: z.string(),
    })
    .optional(),
});

const PistonRuntimeSchema = z.object({
  language: z.string(),
  version: z.string(),
  runtime: z.string().optional(),
  aliases: z.array(z.string()).optional(),
});

let CachedLanguages: Language[] | undefined;
let LastCachedLanguagesAt = 0;

export function setCachedLanguages(languages: Language[]) {
  CachedLanguages = languages;
  LastCachedLanguagesAt = Date.now();
}

/**
 * Fetches all of the possible languages from the Piston API.
 * @returns a list of languages
 */
export async function fetchLanguages() {
  // Grab languages from the cache if they exist and are less than 30 minutes old
  if (CachedLanguages && Date.now() - LastCachedLanguagesAt < 1000 * 60 * 30)
    return CachedLanguages;

  const runtimes = await fetch('https://emkc.org/api/v2/piston/runtimes')
    .then((response) => response.json())
    .then(z.array(PistonRuntimeSchema).parse);

  CachedLanguages = runtimes
    // Filter out languages with duplicate names
    .filter((r, i, a) => {
      // If it has a runtime, it's not a duplicate
      if ('runtime' in r) return true;
      return a.findIndex((r2) => r2.language === r.language) === i;
    })
    .sort((a, b) => a.language.localeCompare(b.language))
    .map(({ runtime, ...language }) => {
      const languageName =
        resolveLanguageName(language.language) ?? language.language;
      const runtimeName = (runtime && resolveRuntimeName(runtime)) ?? runtime;

      return {
        id: `${runtime ? `${runtime}/` : ''}${language.language}`
          // URL safe ID
          .replaceAll('.', 'dot')
          .replaceAll('+', 'plus'),
        key: language.language,
        short: languageName,
        name: `${languageName}${runtimeName ? ` (${runtimeName})` : ''}`,
        aliases: language.aliases,
        version: language.version,
        runtime: runtime
          ? {
              id: runtime,
              key: runtime,
              name: runtimeName ?? runtime,
            }
          : undefined,
      };
    });

  /*
  LastCachedLanguagesAt = Date.now();
  CachedLanguages = runtimes
    .filter(
      (e, i, a) =>
        !('runtime' in e) &&
        a.findIndex((r) => r.language === e.language) === i,
    )
    .sort((a, b) => a.language.localeCompare(b.language))
    .map(({ runtime, ...language }) => {
      const languageName = formatLanguageName(language.language);
      const runtimeName = runtime && formatRuntimeName(runtime);

      return {
        id: `${runtime ? `${runtime}/` : ''}${language.language}`
          // URL safe ID
          .replaceAll('.', 'dot')
          .replaceAll('+', 'plus'),
        key: language.language,
        name: `${languageName}${runtimeName ? ` (${runtimeName})` : ''}`,
        aliases: language.aliases,
        version: language.version,
        runtime: runtime
          ? {
              id: runtime,
              key: runtime,
              name: runtimeName ?? runtime,
            }
          : undefined,
      };
    });
    */

  return CachedLanguages;
}

/**
 * Grab a language by its ID.
 * @param id the language ID
 * @returns the language, or undefined if it does not exist
 */
export async function getLanguage(id: string) {
  const languages = await fetchLanguages();
  return languages.find((l) => l.id === id);
}

const PreferredRuntimes = new Map([
  ['javascript', 'node'],
  ['typescript', undefined],
]);

/**
 * Find a language by its name, alias, or ID.
 * @param resolvable the language resolvable
 * @returns the language, or undefined if it does not exist
 */
export async function findLanguage(_resolvable: string) {
  const resolvable = _resolvable.toLowerCase().trim();
  if (resolvable === '') return undefined;

  const languages = await fetchLanguages();
  return languages.find((language) => {
    const isStraightMatch = [
      language.id,
      language.key,
      language.name.toLowerCase(),
      ...(language.aliases ?? []),
    ].some((value) => value === resolvable);

    if (!isStraightMatch) return false;
    if (resolvable !== language.key) return true;

    // For example: By default 'javascript' will return 'deno' due to
    // being alphabetically first, but we want to prefer 'node' over 'deno'
    const preferredRuntime = PreferredRuntimes.get(language.key);

    return !preferredRuntime || preferredRuntime === language.runtime?.key;
  });
}

/**
 * Search for languages by a query.
 * @param query the query
 * @returns a list of possible matching languages
 */
export async function searchLanguages(query: string) {
  if (query.length === 0) return [];

  const languages = await fetchLanguages();
  const keys = ['id', 'name', 'aliases', 'runtime.id', 'runtime.name'];
  const fuse = new Fuse(languages, { keys, threshold: 0.3 });
  return fuse.search(query).map(({ item }) => item);
}
