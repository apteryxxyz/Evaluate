import * as aibn from './aibn';
import * as chatgptduo from './chatgptduo';
import type { ChatMessage } from './helpers';

/** Create a OpenAI chat completion for the given messages. */
export async function createChatCompletion(messages: ChatMessage[]) {
  const aibnPromise = aibn.createChatCompletion(messages);
  const chatgptduoPromise = chatgptduo.createChatCompletion(messages);
  const results = await Promise.allSettled([aibnPromise, chatgptduoPromise]);

  const eariliestFulfilled = results.find((r) => r.status === 'fulfilled');
  if (!eariliestFulfilled || eariliestFulfilled.status !== 'fulfilled')
    throw new Error('An error occurred while fetching from OpenAI API');
  return eariliestFulfilled.value;
}
