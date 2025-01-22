import { InteractionType } from '@buape/carbon';
import env from './env';
import analytics from './services/analytics';
import client from './services/client';

export default async function handler(request: Request) {
  if (!client) return new Response('X|', { status: 503 });
  const url = new URL(request.url, env.WEBSITE_URL);

  if (url.pathname.endsWith('/deploy')) {
    if (request.method !== 'GET') return new Response(':O', { status: 405 });
    const passedSecret = url.searchParams.get('secret');
    if (passedSecret !== env.DISCORD_CLIENT_ID)
      return new Response(':(', { status: 401 });
    await client.handleDeployRequest();
    return new Response(':)', { status: 200 });
  }

  if (url.pathname.endsWith('/interactions')) {
    if (request.method !== 'POST') return new Response(':O', { status: 405 });

    // @ts-expect-error - validateInteraction is a private method
    const isValid = await client.validateInteractionRequest(request);
    if (!isValid) return new Response('>:(', { status: 401 });

    const interaction = await request.json();

    if (interaction.type === 1) return Response.json({ type: 1 });

    const user = interaction.member?.user ?? interaction.user;
    if (analytics && user)
      analytics.capture({
        distinctId: user.id,
        event: 'interaction received',
        properties: {
          platform: 'discord bot',
          'interaction type': InteractionType[interaction.type],
          'guild id': interaction.guild?.id || null,

          $set_once: {
            platform: 'discord bot',
            username: user.username,
          },
        },
      });

    if (interaction.type === InteractionType.ApplicationCommand)
      await client.commandHandler.handleCommandInteraction(interaction);
    if (interaction.type === InteractionType.MessageComponent)
      await client.componentHandler.handleInteraction(interaction);
    if (interaction.type === InteractionType.ModalSubmit)
      await client.modalHandler.handleInteraction(interaction);

    if (analytics) await analytics.shutdown();
    return new Response(':)', { status: 200 });
  }

  return new Response(':/', { status: 404 });
}
