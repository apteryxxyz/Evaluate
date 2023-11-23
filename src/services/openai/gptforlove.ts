import * as CryptoJS from 'crypto-js';
import type { ChatMessage } from './helpers';
import { formatPrompt, handleResponse, sortMessages } from './helpers';

/** Create a OpenAI chat completion for the given messages. */
export async function createChatCompletion(messages: ChatMessage[]) {
  const webUrl = new URL('https://ai21.gptforlove.com');
  const apiUrl = new URL('https://api.gptplus.one/chat-process');

  const headers = new Headers({
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    'Content-Type': 'application/json',
    Origin: webUrl.origin,
    Referer: webUrl.origin + '/',
  });

  const [systemMessage, ...newMessages] = sortMessages(messages);
  const body = JSON.stringify({
    systemMessage: systemMessage?.content,
    prompt: formatPrompt(newMessages),
    options: {},
    temperature: 0.8,
    top_p: 1,
    secret: getSecret(),
  });

  return fetch(apiUrl, { method: 'POST', headers, body })
    .then((r) => handleResponse(r, () => r.text()))
    .then((t) => t.split('\n').filter(Boolean).at(-1)!)
    .then((s) => {
      try {
        return (JSON.parse(s) as { text: string }).text;
      } catch {
        throw new Error('Could not parse response, likely rate limited');
      }
    });
}

export function getSecret() {
  const k = '14487141bvirvvG';
  const e = Math.floor(new Date().getTime() / 1e3);
  const t = CryptoJS.enc.Utf8.parse(e.toString());
  const o = CryptoJS.AES.encrypt(t, k, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return o.toString();
}
