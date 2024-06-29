import {
  type APIInteraction,
  InteractionResponseType,
  InteractionType,
} from 'discord-api-types/v10';
import { verifyKey } from 'discord-interactions';
import { isButton } from './builders/button';
import { isAutocomplete, isChatInputCommand } from './builders/chat-input';
import { isModal } from './builders/modal';
import { env } from './env';
import {
  buttonComponents,
  chatInputCommands,
  modalComponents,
} from './interactions';
import analytics from './services/analytics';
import { getUser } from './utilities/interaction-helpers';

export default async function handler(request: Request) {
  if (
    !env.DISCORD_TOKEN ||
    !env.DISCORD_PUBLIC_KEY ||
    !env.DISCORD_CLIENT_ID ||
    !env.DISCORD_CLIENT_SECRET
  )
    return new Response(null, { status: 404 });
  if (request.method !== 'POST') return new Response(null, { status: 405 });

  const body = await request.json().catch(() => null);
  const buffer = Buffer.from(JSON.stringify(body));
  if (buffer.length === 0) return new Response(null, { status: 400 });

  const signature = request.headers.get('X-Signature-Ed25519');
  const timestamp = request.headers.get('X-Signature-Timestamp');
  if (!signature || !timestamp) return new Response(null, { status: 400 });

  if (!verifyKey(buffer, signature, timestamp, env.DISCORD_PUBLIC_KEY))
    return new Response(null, { status: 401 });

  console.info('Received interaction');
  const interaction = body as APIInteraction;

  try {
    if (interaction.type === InteractionType.Ping) {
      console.info('Detected as ping, responding with pong');
      return Response.json({ type: InteractionResponseType.Pong });
    }

    analytics?.capture({
      distinctId: getUser(interaction)?.id!,
      event: 'interaction received',
      properties: {
        platform: 'discord bot',
        'interaction type': InteractionType[interaction.type],
        'guild id': interaction.guild_id,

        $set_once: {
          platform: 'discord bot',
          username: getUser(interaction)?.username,
        },
      },
    });

    if (isChatInputCommand(interaction) || isAutocomplete(interaction)) {
      const command = chatInputCommands[interaction.data.name];
      if (!command)
        throw new Error(`Command not found: ${interaction.data.name}`);

      if (isAutocomplete(interaction)) {
        if (command.autocomplete) {
          console.info('Detected as autocomplete, handing off to handler');
          await command.autocomplete(interaction);
        } else {
          throw new Error('Command does not support autocomplete');
        }
      } else {
        console.info('Detected as chat input command, handing off to handler');
        await command.handler(interaction);
      }
    }
    //
    else if (isModal(interaction)) {
      const component = modalComponents.find((c) => c.check(interaction));
      if (!component) throw new Error('Modal component not found');

      console.info('Detected as modal, handing off to handler');
      await component.handler(interaction);
    }
    //
    else if (isButton(interaction)) {
      const component = buttonComponents.find((c) => c.check(interaction));
      if (!component) throw new Error('Button component not found');

      console.info('Detected as button, handing off to handler');
      await component.handler(interaction);
    }
    //
    else {
      throw new Error(`Unknown interaction type: ${interaction.type}`);
    }
  } catch (error) {
    console.error('Error while handling interaction', error);
    return new Response(null, { status: 500 });
  }

  console.info('Successfully handled interaction, responding with 200');
  await analytics?.shutdownAsync();
  return new Response(null, { status: 200 });
}
