import type { ChatMessage } from './helpers';
import { formatPrompt, handleResponse } from './helpers';

/** Create a OpenAI chat completion for the given messages. */
export async function createChatCompletion(messages: ChatMessage[]) {
  const url = new URL('https://gptgo.ai');
  const headers = new Headers({
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    Origin: url.origin,
    Referer: url.origin + '/',
  });

  const tokenUrl = new URL('https://gptgo.ai/action_get_token.php');
  tokenUrl.search = new URLSearchParams({
    q: formatPrompt(messages),
    hlgpt: 'default',
    hl: 'en',
  }).toString();
  const token = await fetch(tokenUrl, { method: 'GET', headers })
    .then((r) => handleResponse(r, () => r.json()))
    .then((json) => (json as { token: string }).token);

  const chatUrl = new URL('https://gptgo.ai/action_ai_gpt.php');
  chatUrl.search = new URLSearchParams({ token }).toString();
  return await fetch(chatUrl, { method: 'GET', headers })
    .then((r) => handleResponse(r, () => r.text()))
    .then((text) => {
      try {
        return text
          .split('\n')
          .filter(Boolean)
          .slice(0, -2)
          .map((l) => JSON.parse(l.replace('data: ', '')) as ChatResponse)
          .reduce((acc, cur) => acc + cur.choices[0].delta.content ?? '', '');
      } catch {
        throw new Error('Could not parse response, likely rate limited');
      }
    });
}

interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      content?: string;
    };
    finish_reason: null | 'stop';
  }[];
}
