import Fuse from 'fuse.js';
import { z } from 'zod';
import { resolveLanguageName, resolvePreferredRuntime } from './resolve';
import { Language, PistonRuntimeSchema } from './schemas';

let CachedLanguages: Language[] | undefined;
let LastCachedLanguagesAt = 0;
export function setCachedLanguages<T extends Language[]>(languages: T) {
  CachedLanguages = languages;
  LastCachedLanguagesAt = Date.now();
  return languages;
}

/**
 * Fetch all of the possible languages from the Piston API.
 * @returns a list of languages
 */
export async function fetchLanguages(): Promise<Language[]> {
  // Grab languages from the cache if they exist and are less than 30 minutes old
  if (CachedLanguages && Date.now() - LastCachedLanguagesAt < 1000 * 60 * 30)
    return CachedLanguages;

  const runtimes = await fetch('https://emkc.org/api/v2/piston/runtimes')
    .then((response) => response.json())
    .then(z.array(PistonRuntimeSchema).parse);

  return setCachedLanguages(
    runtimes
      // Filter out languages with duplicate names
      .filter((r, i, a) => {
        if (r.language === 'brainfuck') return false;

        // If it has a runtime, it's not a duplicate
        if ('runtime' in r) return true;

        return (
          a.findIndex((r2) => {
            if ('runtime' in r2) return false;
            if ('runtime' in r && !('runtime' in r2)) return false;
            return r2.language === r.language;
          }) === i
        );
      })
      .sort((a, b) => a.language.localeCompare(b.language))
      .map(({ runtime, ...language }) => {
        const languageName =
          resolveLanguageName(language.language) ?? language.language;
        const runtimeName =
          (runtime && resolveLanguageName(runtime)) ?? runtime;

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
        } satisfies Language;
      }),
  );
}

/**
 * Grab a language by its ID.
 * @param id the language ID
 * @returns the language, or undefined if it does not exist
 */
export async function getLanguage(id: string): Promise<Language | undefined> {
  const languages = await fetchLanguages();
  return languages.find((l) => l.id === id);
}

/**
 * Find a language by its name, alias, ID, etc.
 * @param resolvable the language resolvable
 * @returns the language, or undefined if it does not exist
 */
export async function findLanguage(
  resolvable: string,
): Promise<Language | undefined> {
  resolvable = resolvable.toLowerCase().trim();
  if (!resolvable) return undefined;

  const languages = await fetchLanguages();
  return languages.find((language) => {
    const isStraightMatch = [
      language.id,
      language.key,
      language.short,
      language.name.toLowerCase(),
      ...(language.aliases ?? []),
    ].some((v) => v === resolvable);

    if (!isStraightMatch) return false;
    if (resolvable !== language.key) return true;

    // For example: By default 'javascript' will return 'deno' due to
    // being alphabetically first, but we want to prefer 'node' over 'deno'
    const preferredRuntime = resolvePreferredRuntime(language.key);
    if (!preferredRuntime && !language.runtime) return true;
    return language.runtime?.key === preferredRuntime;
  });
}

/**
 * Search for languages by name, alias, ID, etc.
 * @param query the query to search for
 * @returns a list of languages
 */
export async function searchLanguages(query: string): Promise<Language[]> {
  if (query.length === 0) return [];

  const languages = await fetchLanguages();
  const keys = ['id', 'name', 'aliases', 'runtime.id', 'runtime.name'];
  const fuse = new Fuse(languages, { keys, threshold: 0.3 });
  return fuse.search(query).map(({ item }) => item);
}
