export function buildLocalesFile(locales: Record<string, string>) {
  return `
// This file is generated automatically, any changes will be overwritten

export const locales = Object.assign(
  ${JSON.stringify(Object.keys(locales))} as const,
  { ${Object.entries(locales)
    .map(([k, v]) => `'${k}': '${v}'`)
    .join(', ')} },
);
export type Locale = (typeof locales)[number];
  `.trim();
}
