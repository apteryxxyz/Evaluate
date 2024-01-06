// TODO: Combine these into a single file, this has lots of duplication in terms of keys
import Abbreviations from '../data/abbreviations.json';
import Files from '../data/files.json';
import Icons from '../data/icons.json';

// TODO:
// - Add language colours
// - Add better syntax highlighting for code blocks on Discord

const ReversedAbbreviations = Object.fromEntries(
  Object.entries(Abbreviations) //
    .flatMap(([key, value]) => [key, ...value].map((v) => [v, key])),
);

/**
 * Get the language name from a potential language name.
 * @param name the potential language name
 * @returns the resolved language name, otherwise null
 */
export function resolveLanguageName(name: string) {
  return ReversedAbbreviations[name.toLowerCase()] ?? null;
}

/**
 * Get the file name for a language.
 * @param name the language name
 * @returns the file name for the language, otherwise null
 */
export function resolveLanguageFileName(name: string) {
  name = resolveLanguageName(name) ?? '';
  return Files[name as keyof typeof Files] ?? null;
}

/**
 * Get the file extension for a language.
 * @param name the language name
 * @returns the file extension for the language, otherwise null
 */
export function resolveLanguageFileExtension(name: string) {
  return resolveLanguageName(name)?.split('.').pop() ?? null;
}

/**
 * Get the icon url for a language.
 * @param name the language name
 * @returns the icon url for the language, otherwise null
 */
export function resolveLanguageIconUrl(name: string) {
  name = resolveLanguageName(name) ?? '';
  const icon = Icons[name as keyof typeof Icons];
  if (!icon) return null;
  return `https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/${icon}.svg`;
}

const PreferredRuntimes = new Map([
  ['javascript', 'node'],
  ['typescript', undefined],
]);

export function resolvePreferredRuntime(language: string) {
  return PreferredRuntimes.get(language) ?? null;
}
