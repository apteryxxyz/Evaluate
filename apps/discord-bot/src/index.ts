import { InteractionType } from '@buape/carbon';
import env from './env.js';
import discord from './services/discord.js';
import posthog from './services/posthog.js';

export default async function handler(request: Request) {
  if (!discord) return new Response('X|', { status: 503 });
  const url = new URL(request.url, env.WEBSITE_URL);

  if (url.pathname.endsWith('/deploy')) {
    if (request.method !== 'GET') return new Response(':O', { status: 405 });

    const passedSecret = url.searchParams.get('secret');
    if (passedSecret !== env.DISCORD_CLIENT_ID)
      return new Response(':(', { status: 401 });
    await discord.handleDeployRequest();

    return new Response(':)', { status: 200 });
  }

  if (url.pathname.endsWith('/interactions')) {
    if (request.method !== 'POST') return new Response(':O', { status: 405 });

    // @ts-expect-error - validateDiscordRequest is a private method
    const valid = await discord.validateDiscordRequest(request);
    if (!valid) return new Response('>:(', { status: 401 });

    const interaction = await request.json();
    if (interaction.type === 1) return Response.json({ type: 1 });
    if (interaction.type === InteractionType.ApplicationCommand)
      await discord.commandHandler.handleCommandInteraction(interaction);
    if (interaction.type === InteractionType.MessageComponent)
      await discord.componentHandler.handleInteraction(interaction);
    if (interaction.type === InteractionType.ModalSubmit)
      await discord.modalHandler.handleInteraction(interaction);
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete)
      await discord.commandHandler.handleAutocompleteInteraction(interaction);

    await posthog?.shutdown();
    return new Response(':)', { status: 200 });
  }

  if (url.pathname.endsWith('/events')) {
    if (request.method !== 'POST') return new Response(':O', { status: 405 });

    // @ts-expect-error - validateDiscordRequest is a private method
    const valid = await discord.validateDiscordRequest(request);
    if (!valid) return new Response('>:(', { status: 401 });

    const event = await request.json();
    if (event.type === 1) return new Response(':)', { status: 200 });
    await discord.eventHandler.handleEvent(event.event, event.event.type);

    await posthog?.shutdown();
    return new Response(':)', { status: 200 });
  }

  return new Response(':/', { status: 404 });
}
