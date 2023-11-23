// import * as gptforlove from './gptforlove';
import * as gptgo from './gptgo';
import type { ChatMessage } from './helpers';

/** Create a OpenAI chat completion for the given messages. */
export async function createChatCompletion(messages: ChatMessage[]) {
  // const gptForLove = gptforlove.createChatCompletion(messages);
  const gptGo = gptgo.createChatCompletion(messages);

  const startedAt = Number(process.env.START_TIMESTAMP ?? Date.now());
  const timeAvailable = 10_000 - (Date.now() - startedAt) - 500;
  const timeOut = new Promise<undefined>((r) => setTimeout(r, timeAvailable));

  try {
    const promises = Promise.any([/*gptForLove,*/ gptGo]);
    const result = await Promise.race([promises, timeOut]);
    if (result) return result;

    throw new Error('All promises timed out');
  } catch (error) {
    console.error('error', error);
    throw new Error('An error occurred while fetching from OpenAI API');
  }
}
