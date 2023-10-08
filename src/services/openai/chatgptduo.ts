import type { ChatMessage } from './helpers';
import { formatPrompt, handleResponse } from './helpers';

/** Create a OpenAI chat completion for the given messages. */
export async function createChatCompletion(messages: ChatMessage[]) {
  const form = new FormData();
  const prompt = formatPrompt(messages);
  form.append('purpose', 'ask');
  form.append('prompt', prompt);
  form.append('search', prompt);

  const url = new URL('https://chatgptduo.com/');
  return fetch(url, { method: 'POST', body: form })
    .then((r) => handleResponse<{ answer: string }>(r, () => r.json() as never))
    .then((json) => json.answer);
}
