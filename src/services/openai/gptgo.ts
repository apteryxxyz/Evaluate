import {
  formatPrompt,
  formatStreamedText,
  handleResponse,
  ignorePreviousMessages,
} from './helpers';
import type { ChatMessage } from './helpers';

/** Create a OpenAI chat completion for the given messages. */
export async function createChatCompletion(messages: ChatMessage[]) {
  const url = new URL('https://gptgo.ai');
  const headers = new Headers({
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    Origin: url.origin,
    Referer: url.origin + '/',
  });

  const tokenUrl = new URL('https://gptgo.ai/get_token.php');
  const tokenForm = new FormData();
  tokenForm.append('ask', formatPrompt(ignorePreviousMessages(messages)));
  const token = await fetch(tokenUrl, {
    method: 'POST',
    headers,
    body: tokenForm,
  })
    .then((r) => handleResponse(r, () => r.text()))
    .then((t) => atob(t.slice(0xa, -0x14)));

  const chatUrl = new URL('https://api.gptgo.ai/web.php');
  chatUrl.search = new URLSearchParams({ array_chat: token }).toString();
  return fetch(chatUrl, { method: 'GET', headers })
    .then((r) => handleResponse(r, () => r.text()))
    .then((text) => {
      try {
        return formatStreamedText(text);
      } catch {
        throw new Error('Could not parse response, likely rate limited');
      }
    });
}
