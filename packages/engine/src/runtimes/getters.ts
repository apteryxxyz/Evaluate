import RuntimeExamples from './data/examples.json';
import RuntimeExtensions from './data/extensions.json';
import RuntimeIcons from './data/icons.json';
import RuntimeNames from './data/names.json';

/**
 * Check if the given identifier is a valid runtime identifier.
 * @param identifier the identifier to check
 * @returns true if the identifier is a valid runtime identifier, false otherwise
 */
export function isRuntimeIdentifier(
  identifier: string,
): identifier is keyof typeof RuntimeNames {
  return identifier in RuntimeNames;
}

/**
 * Get the name of a runtime by its identifier.
 * @param identifier the identifier of the runtime
 * @returns the name of the runtime
 */
export function getRuntimeName(identifier: string) {
  if (!isRuntimeIdentifier(identifier)) return;
  return RuntimeNames[identifier].name;
}

/**
 * Get the aliases of a runtime by its identifier.
 * @param identifier the identifier of the runtime
 * @returns the aliases of the runtime
 */
export function getRuntimeAliases(identifier: string) {
  if (!isRuntimeIdentifier(identifier)) return;
  return RuntimeNames[identifier].aliases;
}

/**
 * Get the default file name of a runtime by its identifier.
 * @param identifier the identifier of the runtime
 * @returns the default file name of the runtime
 */
export function getRuntimeDefaultFileName(identifier: string) {
  if (!isRuntimeIdentifier(identifier)) return;
  return Object.keys(RuntimeExamples[identifier][0]?.files ?? {})[0];
}

/**
 * Get the popularity of a runtime by its identifier.
 * @param identifier the identifier of the runtime
 * @returns the popularity of the runtime
 */
export function getRuntimePopularity(identifier: string) {
  if (!isRuntimeIdentifier(identifier)) return 0;
  return RuntimeNames[identifier].popularity;
}

/**
 * Get the tags of a runtime by its identifier.
 * @param identifier the identifier of the runtime
 * @returns the tags of the runtime
 */
export function getRuntimeTags(identifier: string) {
  if (!isRuntimeIdentifier(identifier)) return [];
  return RuntimeNames[identifier].tags;
}

/**
 * Get the icon of a runtime by its identifier.
 * @param identifier the identifier of the runtime
 * @returns the icon of the runtime
 */
export function getRuntimeIcon(identifier: string) {
  if (!isRuntimeIdentifier(identifier)) return;
  return RuntimeIcons[identifier] ?? undefined;
}

/**
 * Get the examples of a runtime by its identifier.
 * @param identifier the identifier of the runtime
 * @returns the examples of the runtime
 */
export function getRuntimeExamples(identifier: string) {
  if (!isRuntimeIdentifier(identifier)) return [];
  return RuntimeExamples[identifier];
}

/**
 * Get the extensions of a runtime by its identifier.
 * @param extension the extension to check
 * @returns the identifier of the runtime
 */
export function getIconFromExtension(extension: string) {
  for (const [key, value] of Object.entries(RuntimeExtensions))
    if (value.includes(extension)) return getRuntimeIcon(key) ?? undefined;
  return undefined;
}
