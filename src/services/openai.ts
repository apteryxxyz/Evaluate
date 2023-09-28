/** Create a OpenAI chat completion for the given messages. */
export async function createChatCompletion(messages: ChatMessage[]) {
  const baseUrl = new URL('https://gptgo.ai/');
  const headers = new Headers({
    // 'Content-Type': 'application/json',
    Origin: baseUrl.origin,
    Referer: baseUrl.origin + '/',
    'User-Agent':
      'Dalvik/2.1.0 (Linux; U; Android 10; SM-G975F Build/QP1A.190711.020)',
  });

  const getTokenUrl = new URL('/action_get_token.php', baseUrl);
  getTokenUrl.search = new URLSearchParams({
    q: formatPrompt(messages),
    hlgpt: 'default',
    hl: 'en',
  }).toString();

  const token = await fetch(getTokenUrl, { method: 'GET', headers })
    .then((r) => handleResponse(r, () => r.json() as Promise<TokenResponse>))
    .then((json) => json.token);

  const getCompletionUrl = new URL('/action_ai_gpt.php', baseUrl);
  getCompletionUrl.search = new URLSearchParams({
    token,
  }).toString();

  return fetch(getCompletionUrl, { method: 'GET', headers })
    .then((r) => handleResponse(r, () => r.text()))
    .then((data) => {
      let final = '';
      for (const line of data.split('\n')) {
        if (!line.startsWith('data: ')) continue;
        if (line.includes('[DONE]')) break;

        const json = JSON.parse(
          line.slice('data: '.length),
        ) as CompletionLineResponse;
        if (json.choices.length === 0) continue;
        final += json.choices[0].delta.content ?? '';
      }

      return final;
    });
}

interface ChatMessage {
  role: 'assistant' | 'system' | 'user';
  content: string;
}

interface TokenResponse {
  status: boolean;
  token: string;
}

interface CompletionLineResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: { index: 0; delta: { content?: string }; finish_reason: null }[];
}

function formatPrompt(messages: ChatMessage[]) {
  switch (messages.length) {
    case 0:
      return '';
    case 1:
      return messages[0].content;
    default:
      return (
        messages.map((m) => `${m.role}: ${m.content}`).join('\n') +
        '\nassistant:'
      );
  }
}

async function handleResponse<T>(
  response: Response,
  okCallback: () => Promise<T>,
) {
  if (response.ok) {
    return okCallback();
  } else {
    const text = await response.text();
    console.error('response status', response.statusText);
    console.error('response text', text);
    throw new Error('An error occurred while fetching from OpenAI API');
  }
}
