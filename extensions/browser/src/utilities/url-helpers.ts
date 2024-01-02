/**
 * Get the absolute URL for a path.
 * @param path the path to get the absolute URL for
 * @returns the absolute URL
 */
export function absoluteUrl(path = '/') {
  return new URL(path, process.env.PLASMO_PUBLIC_WEBSITE_URL).toString();
}
