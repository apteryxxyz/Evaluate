import RuntimeExamples from './data/examples.json' with { type: 'json' };
import RuntimeExtensions from './data/extensions.json' with { type: 'json' };
import RuntimeIcons from './data/icons.json' with { type: 'json' };
import RuntimeNames from './data/names.json' with { type: 'json' };

//

function toUrl(slug: string) {
  return slug
    .replaceAll('+', 'plus')
    .replaceAll('.', 'dot')
    .replaceAll('#', 'sharp');
}

function fromUrl(slug: string) {
  return slug
    .replaceAll('plus', '+')
    .replaceAll('dot', '.')
    .replaceAll('sharp', '#');
}

/** Make an identifier from a language and runtime */
export function encodeRuntimeId(language: string, runtime?: string) {
  if (language === 'typescript' && !runtime) runtime = 'node';
  const id = `${toUrl(language)}${runtime ? `+${toUrl(runtime)}` : ''}`;
  return isRuntimeId(id) ? id : null;
}

/** Extract the language and runtime from an identifier */
export function decodeRuntimeId(id: string) {
  if (!isRuntimeId(id)) return null;
  const [language, runtime] = id.split('+');
  return [fromUrl(language!), fromUrl(runtime ?? '') || undefined] as const;
}

/** Check if the given value is a valid runtime id */
export function isRuntimeId(id: string): id is keyof typeof RuntimeNames {
  return id in RuntimeNames;
}

//

/** Get the name of a runtime by its id */
export function getRuntimeName(id: string) {
  if (!isRuntimeId(id)) return null;
  return RuntimeNames[id].name ?? null;
}

/** Get the aliases of a runtime by its id */
export function getRuntimeAliases(id: string) {
  if (!isRuntimeId(id)) return null;
  return RuntimeNames[id].aliases;
}

/** Get the default file name of a runtime by its id */
export function getRuntimeDefaultFileName(id: string) {
  if (!isRuntimeId(id)) return null;
  return Object.keys(RuntimeExamples[id][0]?.files ?? {})[0] ?? null;
}

/** Get the popularity of a runtime by its id */
export function getRuntimePopularity(id: string) {
  if (!isRuntimeId(id)) return null;
  return RuntimeNames[id].popularity ?? null;
}

/** Get the tags of a runtime by its id */
export function getRuntimeTags(id: string) {
  if (!isRuntimeId(id)) return null;
  return RuntimeNames[id].tags ?? null;
}

/** Get the icon of a runtime by its id */
export function getRuntimeExamples(id: string) {
  if (!isRuntimeId(id)) return null;
  return RuntimeExamples[id];
}

/** Get the icon URL of a runtime by its id */
export function getRuntimeIconUrl(id: string) {
  if (!isRuntimeId(id)) return null;
  const slug = RuntimeIcons[id];
  if (!slug) return null;
  return `https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/940f2ea7a6fcdc0221ab9a8fc9454cc585de11f0/icons/${slug}.svg`;
}

/** Get the id of a runtime by its icon URL */
export function getRuntimeidFromExtension(extension: string) {
  for (const [key, value] of Object.entries(RuntimeExtensions))
    if (value.includes(extension)) return key;
  return null;
}
