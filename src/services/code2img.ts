export const ThemeVariants = {
  default: {
    theme: 'vsc-dark-plus',
    'background-color': '#2fc086',
    padding: '2',
  },
};

/**
 * Generate a code image using the Code 2 Img API.
 * @param code The code that appears in the image
 * @param theme The theme to use
 */
export function generateCodeImage({
  code,
  language = 'javascript',
  theme = 'default',
}: GenerateCodeImageOptions) {
  const url = new URL('https://code2img.vercel.app/api/to-image');
  const headers = new Headers({ 'Content-Type': 'text/plain' });
  const params = new URLSearchParams({
    code,
    language,
    ...ThemeVariants[theme],
  });
  url.search = params.toString();

  return fetch(url, { method: 'POST', headers, body: code }) //
    .then((res) => res.arrayBuffer())
    .then((buffer) => Buffer.from(buffer));
}

export interface GenerateCodeImageOptions {
  code: string;
  language?: string;
  theme: keyof typeof ThemeVariants;
}
