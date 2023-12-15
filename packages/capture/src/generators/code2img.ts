export const ThemeVariants = {
  default: {
    theme: 'vsc-dark-plus',
    'background-color': '#2fc086',
    padding: '2',
  },
};

/**
 * Generate a code image using code2img.
 * @param options the options to pass to the code2img API
 * @returns a promise that resolves to a buffer containing the image
 */
export function generateImageUsingCode2Img({
  code,
  language = 'javascript',
  theme = 'default',
}: { code: string; language?: string; theme?: keyof typeof ThemeVariants }) {
  const url = new URL('https://code2img.vercel.app/api/to-image');
  const headers = new Headers({ 'Content-Type': 'text/plain' });
  const params = new URLSearchParams({
    code,
    language,
    ...ThemeVariants[theme],
  });
  url.search = params.toString();

  return fetch(url, { method: 'POST', headers, body: code }) //
    .then((response) => response.arrayBuffer());
}
