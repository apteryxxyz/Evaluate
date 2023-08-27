const CURRENT_URL = new URL('https://wewordle.org/gptapi/v1/android/turbo');

/** Create a OpenAI chat completion for the given messages. */
export function createChatCompletion(messages: ChatCompletionMessage[]) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'User-Agent':
      'Dalvik/2.1.0 (Linux; U; Android 10; SM-G975F Build/QP1A.190711.020)',
  });

  const body = JSON.stringify({ user: Date.now().toString(), messages });

  return fetch(CURRENT_URL, { method: 'POST', headers, body }) //
    .then(async (response) => {
      if (response.ok) {
        const json = (await response.json()) as ChatCompletionResponse;
        return json.message.content;
      } else {
        const text = await response.text();
        console.error('current url', CURRENT_URL.toString());
        console.error('headers', headers);
        console.error('body', body);
        console.error('response status', response.statusText);
        console.error('response text', text);
        throw new Error('An error occurred while fetching from OpenAI API');
      }
    });
}

export interface ChatCompletionMessage {
  role: 'assistant' | 'system' | 'user';
  content: string;
}

export interface ChatCompletionResponse {
  limit: number;
  fullLimit: number;
  message: {
    id: string;
    content: string;
    status: 'success' | 'error';
  };
}
