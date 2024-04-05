/**
 * Convert a string to a URL-friendly format.
 * @param input yhe input string
 * @returns the URL-friendly string
 */
function toUrl(input: string) {
  return input
    .replaceAll('+', 'plus')
    .replaceAll('.', 'dot')
    .replaceAll('#', 'sharp');
}

function fromUrl(input: string) {
  return input
    .replaceAll('plus', '+')
    .replaceAll('dot', '.')
    .replaceAll('sharp', '#');
}

/**
 * Make an identifier from a language and runtime.
 * @param language the name of the language
 * @param runtime the optional name of the runtime
 * @returns the identifier
 */
export function makeIdentifier(language: string, runtime?: string) {
  if (language === 'typescript' && !runtime) runtime = 'node';
  return `${toUrl(language)}${runtime ? `+${toUrl(runtime)}` : ''}`;
}

/**
 * Extract the language and runtime from an identifier.
 * @param identifier the identifier to extract from
 * @returns the extracted language and runtime
 */
export function extractIdentifier(identifier: string) {
  const [language, runtime] = identifier.split('+');
  return {
    language: fromUrl(language!),
    runtime: runtime ? fromUrl(runtime) : undefined,
  };
}
