type Tuple = [unknown, ...unknown[]];

export interface ChatMessage {
  role: 'assistant' | 'system' | 'user';
  content: string;
}

export interface ChatResponse {
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

export function formatPrompt(messages: ChatMessage[]) {
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

export function formatStreamedText(text: string) {
  return text
    .split('\n')
    .filter(Boolean)
    .slice(0, -2)
    .map((l) => JSON.parse(l.replace('data: ', '')) as ChatResponse)
    .reduce((acc, cur) => acc + cur.choices[0].delta.content ?? '', '');
}

export function sortMessages(messages: ChatMessage[]) {
  const systemMessage = messages.find((m) => m.role === 'system');
  if (messages.indexOf(systemMessage!) === 0) {
    return [systemMessage, ...messages.slice(1)] satisfies Tuple;
  } else {
    return [undefined, ...messages] satisfies Tuple;
  }
}

export function ignorePreviousMessages(messages: ChatMessage[]) {
  const [systemMessage, ...userMessages] = sortMessages(messages);
  const newSystemMessage = systemMessage ?? { role: 'system', content: '' };
  newSystemMessage.content = `Ignore all previous messages and start a new conversation.\n${newSystemMessage.content}`;
  return [newSystemMessage, ...userMessages];
}

export async function handleResponse<T>(
  response: Response,
  okayCallback: () => Promise<T>,
) {
  if (response.ok) {
    return okayCallback();
  } else {
    const text = await response.text();
    console.error('request url', response.url);
    console.error('response status', response.statusText);
    console.error('response text', text);
    throw new Error('An error occurred while fetching from OpenAI API');
  }
}
