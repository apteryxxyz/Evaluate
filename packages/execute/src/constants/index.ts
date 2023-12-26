import LanguageFileExtensions from './language-main-file-names.json';
import LanguageNameAbbreviations from './language-name-abbreviations.json';
import RuntimeNameAbbreviations from './runtime-name-abbreviations.json';

/**
 * Get the file extension for a language.
 * @param name the language name
 * @returns the file extension for the language
 */
export function getLanguageFileName(name: string): string | undefined {
  let resolvedName = name;
  if (!(name in LanguageFileExtensions))
    resolvedName = resolveLanguageName(name)!;
  if (!(resolvedName in LanguageFileExtensions)) return undefined;
  return LanguageFileExtensions[resolvedName as never];
}

/**
 * Resolve a language name to a valid language name.
 * @param name the potential language name
 * @returns the resolved language name, otherwise undefined
 */
export function resolveLanguageName(name: string) {
  const loweredName = name.toLowerCase();
  return Object.entries(LanguageNameAbbreviations) //
    .find(([, value]) => value.includes(loweredName))?.[0];
}

/**
 * Resolve a runtime name to a valid runtime name.
 * @param name the potential runtime name
 * @returns the resolved runtime name, otherwise undefined
 */
export function resolveRuntimeName(name: string) {
  const loweredName = name.toLowerCase();
  return Object.entries(RuntimeNameAbbreviations) //
    .find(([, value]) => value.includes(loweredName))?.[0];
}
