import * as gptforlove from './gptforlove';
import * as gptgo from './gptgo';
import type { ChatMessage } from './helpers';

/** Create a OpenAI chat completion for the given messages. */
export async function createChatCompletion(messages: ChatMessage[]) {
  const gptForLove = gptforlove.createChatCompletion(messages);
  const gptGo = gptgo.createChatCompletion(messages);
  const results = await Promise.allSettled([gptForLove, gptGo]);

  const eariliestFulfilled = results //
    .find((r) => r.status === 'fulfilled');
  if (!eariliestFulfilled || eariliestFulfilled.status !== 'fulfilled') {
    console.error('all results', results);
    throw new Error('An error occurred while fetching from OpenAI API');
  }

  return eariliestFulfilled.value;
}
