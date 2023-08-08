/**
 * Create a paste on dpaste.com.
 * @param options The options for the paste
 */
export async function createPaste(options: CreatePasteOptions) {
  return fetch('https://dpaste.com/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: (() => {
      const body = new URLSearchParams();
      body.append('title', options.title ?? '');
      body.append('syntax', options.syntax ?? '');
      body.append('content', options.content);
      body.append('expiry_days', '1');
      return body;
    })(),
    redirect: 'manual',
  }).then((response) => {
    const location = response.headers.get('location');
    return `https://dpaste.com${location ?? ''}`;
  });
}

export interface CreatePasteOptions {
  title?: string;
  content: string;
  syntax?: string;
}
