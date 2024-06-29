import { env } from '~/env';

/**
 * Run a model with the given messages.
 * @param model - The model to run
 * @param messages - The messages to send to the model
 * @returns The response from the model
 */
export async function runModel(
  // Currently only Meta models on Cloudflare are supported
  model: `@cf/meta/${string}`,
  messages: { role: 'system' | 'user'; content: string }[],
) {
  const path = `/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`;
  const url = new URL(path, 'https://api.cloudflare.com');

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${env.CLOUDFLARE_API_TOKEN}`);
  headers.set('Content-Type', 'application/json');

  const body = JSON.stringify({ messages });

  const response = await fetch(url, { method: 'POST', headers, body });
  if (!response.ok) throw new Error('Failed to call AI service');

  const json = await response.json();
  // TODO: Response would be different for different models
  return json as {
    result: { response: string };
    success: boolean;
    errors: string[];
    messages: { role: 'system' | 'user'; content: string }[];
  };
}
