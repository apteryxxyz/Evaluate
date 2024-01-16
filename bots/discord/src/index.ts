import { determineInteractionLocale } from '@evaluate/translate';
import {
  APIInteraction,
  InteractionResponseType,
  InteractionType,
} from 'discord-api-types/v10';
import { verifyKey } from 'discord-interactions';
import { isButton } from './builders/button';
import { isAutocomplete, isChatInputCommand } from './builders/chat-input';
import { isModal } from './builders/modal';
import { analytics } from './core';
import {
  buttonComponents,
  chatInputCommands,
  modalComponents,
} from './interactions';

export default async function handler(request: Request & { body: Buffer[] }) {
  // DEBUGGING CRAP STARTS HERE
  const allHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {    allHeaders[key] = value;  });
  console.log('Request headers', allHeaders);
  
  try {
    const asText = await request.clone().text();
  console.log('Request body as text', asText);
  } catch (error) {
    console.log('Request body as text', 'errored', error);
  }

  try {
    const [, asStreamClone] = request.clone().body?.tee() ?? [];
  const decoder = new TextDecoder();
  const asStreamText = decoder.decode(asStreamClone as any);
  console.log('Request body as stream', asStreamText);
  } catch (error) {
    console.log('Request body as stream', 'errored', error);
  }
  // DEBUGGING CRAP ENDS HERE

  const body = await request.json().catch(() => ({}));
  const buffer = Buffer.from(JSON.stringify(body));
  if (buffer.length === 0) return new Response(null, { status: 400 });

  const signature = request.headers.get('X-Signature-Ed25519');
  const timestamp = request.headers.get('X-Signature-Timestamp');
  if (!signature || !timestamp) return new Response(null, { status: 400 });

  const key = process.env.DISCORD_PUBLIC_KEY;
  if (!key) return new Response(null, { status: 500 });

  if (!verifyKey(buffer, signature, timestamp, key))
    return new Response(null, { status: 401 });

  console.info('Received interaction');
  const interaction = body as APIInteraction;

  try {
    if (interaction.type === InteractionType.Ping) {
      console.info('Detected as ping, responding with pong');
      return Response.json({ type: InteractionResponseType.Pong });
    }

    analytics?.append('platform', 'discord bot');
    analytics?.append('url', '/api/interaction');
    analytics?.append('language', determineInteractionLocale(interaction));

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
  return new Response(null, { status: 200 });
}
