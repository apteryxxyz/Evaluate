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
 * Generate a code image using Carbonara.
 * @param options the options to pass to the Carbonara API
 * @returns a promise that resolves to a buffer containing the image
 */
export function generateImageUsingCarbonara({
  code,
  theme = 'default',
}: { code: string; theme?: keyof typeof ThemeVariants }) {
  const url = new URL('https://carbonara.solopov.dev/api/cook');
  const body = JSON.stringify({ code, ...ThemeVariants[theme] });
  const headers = new Headers({ 'Content-Type': 'application/json' });

  return fetch(url, { method: 'POST', body, headers }) //
    .then((response) => response.arrayBuffer());
}
