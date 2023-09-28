export interface ChatMessage {
  role: 'assistant' | 'system' | 'user';
  content: string;
}

export function grabSystemMessage(messages: ChatMessage[]) {
  if (messages.length === 0) return [undefined, messages] as const;
  const systemMessage = messages.find((m) => m.role === 'system');
  if (messages.indexOf(systemMessage!) === 0) {
    return [systemMessage, messages.slice(1)] as const;
  } else {
    return [undefined, messages] as const;
  }
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

export async function handleResponse<T>(
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
