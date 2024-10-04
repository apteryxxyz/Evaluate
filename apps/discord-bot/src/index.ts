import {
  Client,
  ClientMode,
  InteractionResponseType,
  InteractionType,
} from '@buape/carbon';
import { EvaluateCommand } from './commands/evaluate';
import { env } from './env';
import analytics from './services/analytics';

const client = new Client(
  {
    token: env.DISCORD_TOKEN ?? 'x',
    publicKey: env.DISCORD_PUBLIC_KEY ?? 'x',
    clientId: env.DISCORD_CLIENT_ID ?? 'x',
    mode: env.ENV === 'development' ? ClientMode.NodeJS : ClientMode.Vercel,
    autoRegister: true,
    requestOptions: {
      queueRequests: false,
    },
  },
  [new EvaluateCommand()],
);

export default async function handler(request: Request) {
  if (
    !env.DISCORD_TOKEN ||
    !env.DISCORD_PUBLIC_KEY ||
    !env.DISCORD_CLIENT_ID ||
    !env.DISCORD_CLIENT_SECRET
  )
    return new Response(null, { status: 503 });

  if (request.url.endsWith('/deploy')) {
    if (request.method !== 'GET') return new Response(null, { status: 405 });
    await client.deployCommands();
    return new Response(null, { status: 204 });
  }

  if (request.url.endsWith('/interaction')) {
    if (request.method !== 'POST') return new Response(null, { status: 405 });
    // @ts-expect-error - validateInteraction is a private method
    const isValid = await client.validateInteraction(request);
    if (!isValid) return new Response(null, { status: 401 });

    const interaction = await request.json();

    if (interaction.type === InteractionType.Ping)
      return Response.json({ type: InteractionResponseType.Pong });

    console.log('[INTERACTION] Received interaction', interaction);
    const user = interaction.member?.user ?? interaction.user;
    analytics?.capture({
      distinctId: user.id,
      event: 'interaction received',
      properties: {
        platform: 'discord bot',
        'interaction type': InteractionType[interaction.type],
        'guild id': interaction.guild_id,

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
    return new Response(null, { status: 204 });
  }

  if (request.url.endsWith('/debug')) {
    if (request.method !== 'GET') return new Response(null, { status: 405 });
    return Response.json({
      modals: client.modalHandler.modals,
      commands: client.commandHandler.client.commands,
      components: client.componentHandler.components,
    });
  }

  return new Response(null, { status: 404 });
}
