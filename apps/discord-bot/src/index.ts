import { createHandler } from '@buape/carbon/adapters/fetch';
import discord from './services/discord.js';
import posthog from './services/posthog.js';

const handler = discord && createHandler(discord);

export default async function override(request: Request) {
  if (!discord || !handler)
    return new Response('Service Unavailable', { status: 503 });

  const response = await handler(request, {});
  await posthog?.shutdown();
  return response;
}
