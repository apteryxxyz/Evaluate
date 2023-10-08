import { createHash } from 'crypto';
import type { ChatMessage } from './helpers';
import { handleResponse } from './helpers';

/** Create a OpenAI chat completion for the given messages. */
export async function createChatCompletion(messages: ChatMessage[]) {
  const url = new URL('https://aibn.cc/api/generate');
  const headers = new Headers({
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    Origin: url.origin,
    Referer: url.origin + '/',
  });

  const timestamp = Date.now();
  const body = JSON.stringify({
    messages,
    pass: null,
    sign: generateSignature(timestamp, messages.at(-1)!.content),
    time: timestamp,
  });

  return fetch(url, { method: 'POST', headers, body }) //
    .then((r) => handleResponse(r, () => r.text()));
}

function generateSignature(
  timestamp: number,
  message: string,
  secret = 'undefined',
): string {
  const data = `${timestamp}:${message}:${secret}`;
  const sha256Hash = createHash('sha256');
  sha256Hash.update(data);
  return sha256Hash.digest('hex');
}
