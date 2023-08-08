export const ThemeVariants = {
  default: {
    backgroundColor: '#2fc086',
    windowControls: false,
    // prettify: true,
    paddingHorizontal: '32px',
    paddingVertical: '32px',
  },
};

/**
 * Generate a code image using the Carbonara API.
 * @param code The code that appears in the image
 * @param theme The theme to use
 */
export function generateCodeImage({
  code,
  theme = 'default',
}: GenerateCodeImageOptions) {
  const url = new URL('https://carbonara.solopov.dev/api/cook');
  const body = JSON.stringify({ code, ...ThemeVariants[theme] });
  const headers = new Headers({ 'Content-Type': 'application/json' });

  return fetch(url, { method: 'POST', headers, body }) //
    .then((res) => res.arrayBuffer())
    .then((buffer) => Buffer.from(buffer));
}

export interface GenerateCodeImageOptions {
  code: string;
  theme: keyof typeof ThemeVariants;
}
