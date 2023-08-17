const CURRENT_URL = new URL(
  'https://next.eqing.tech/api/openai/v1/chat/completions',
);

export function createCompletion(
  messages: ChatCompletionMessage[],
  options: CreateCompletionOptions = {
    model: 'gpt-3.5-turbo',
    temperature: 0.5,
    frequency_penalty: 0,
    presence_penalty: 0,
    top_p: 1,
  },
) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    Origin: 'https://next.eqing.tech',
    Referer: 'https://next.eqing.tech/',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    Plugins: '0',
  });

  const body = JSON.stringify({
    ...options,
    messages,
    stream: false,
  });

  return fetch(CURRENT_URL, { method: 'POST', headers, body }) //
    .then(async (response) => {
      if (response.ok)
        return response.json() as Promise<ChatCompletionResponse>;

      const body = await response.text();
      console.error('error', response.statusText, body);
      return null;
    })
    .then((r) => r?.choices[0].message.content);
}

export interface CreateCompletionOptions {
  model: 'gpt-3.5-turbo';
  frequency_penalty?: number;
  presence_penalty?: number;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
}

export interface ChatCompletionMessage {
  role: 'assistant' | 'system' | 'user';
  content: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: 'gpt-3.5-turbo';
  choices: {
    index: number;
    message: ChatCompletionMessage;
    finish_reason: string | null;
  }[];
  usgae: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
