const DEFAULT_SYSTEM_MESSAGE =
  "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.";

/**
 * Create a completion using the ChatGPT model.
 * @param params The messages to send to the model
 */
export async function createCompletion(
  ...params:
    | [messages: ChatCompletionMessage[]]
    | [systemMessageContent: string, messages: ChatCompletionMessage[]]
) {
  const [systemMessageContent, messages] =
    params.length === 1 ? [DEFAULT_SYSTEM_MESSAGE, ...params] : params;

  const headers = new Headers({
    'Content-Type': 'application/json',
    'User-Agent':
      'Dalvik/2.1.0 (Linux; U; Android 10; SM-G975F Build/QP1A.190711.020)',
  });
  const body = JSON.stringify({
    user: Date.now().toString(),
    messages: [{ role: 'system', content: systemMessageContent }, ...messages],
  });

  return fetch('https://wewordle.org/gptapi/v1/android/turbo', {
    method: 'POST',
    headers,
    body,
  })
    .then(async (response) => {
      if (!response.ok)
        throw new Error(response.statusText + ' | ' + (await response.text()));
      return response.json() as Promise<ChatCompletionResponse>;
    })
    .then((json) => json.message.content);
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
    created: number;
    role: 'assistant';
    content: string;
    status: 'success';
  };
}
