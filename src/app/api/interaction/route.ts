import type { APIInteraction } from 'discord-api-types/v10';
import {
  InteractionResponseType,
  InteractionType,
} from 'discord-api-types/v10';
import { verifyKey } from 'discord-interactions';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  isAutocomplete,
  isChatInputCommand,
  isMessageMenuCommand,
} from '@/builders/command';
import { isButton, isModal, isSelectMenu } from '@/builders/component';
import {
  buttonComponents,
  chatInputCommands,
  messageMenuCommands,
  modalComponents,
  selectMenuComponents,
} from '@/interactions';

export async function POST(request: NextRequest) {
  process.env.REQUEST_TYPE = 'interaction';
  process.env.START_TIMESTAMP = Date.now().toString();

  const body = await request.json();

  const buffer = Buffer.from(JSON.stringify(body));
  if (buffer.length === 0) return new NextResponse(null, { status: 400 });

  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  if (!signature || !timestamp) return new NextResponse(null, { status: 400 });

  const key = process.env.DISCORD_PUBLIC_KEY;
  if (!verifyKey(buffer, signature, timestamp, key))
    return new NextResponse(null, { status: 401 });

  console.info('Received interaction');
  const interaction = body as APIInteraction;

  try {
    if (interaction.type === InteractionType.Ping) {
      console.info('Detected as ping, responding with pong');
      return NextResponse.json({ type: InteractionResponseType.Pong });
    } else if (isChatInputCommand(interaction) || isAutocomplete(interaction)) {
      const command = chatInputCommands[interaction.data.name];
      if (!command) return new NextResponse(null, { status: 400 });

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
    } else if (isMessageMenuCommand(interaction)) {
      const command = messageMenuCommands[interaction.data.name];
      if (command) {
        console.info(
          'Detected as message menu command, handing off to handler',
        );
        await command.handler(interaction);
      }
    } else if (isModal(interaction)) {
      const component = modalComponents.find((c) => c.check(interaction));
      if (component) {
        console.info('Detected as modal, handing off to handler');
        await component.handler(interaction);
      }
    } else if (isButton(interaction)) {
      const component = buttonComponents.find((c) => c.check(interaction));
      if (component) {
        console.info('Detected as button, handing off to handler');
        await component.handler(interaction);
      }
    } else if (isSelectMenu(interaction)) {
      const component = selectMenuComponents.find((c) => c.check(interaction));
      if (component) {
        console.info('Detected as select menu, handing off to handler');
        await component.handler(interaction);
      }
    } else {
      console.info('Detected as unknown interaction, responding with 400');
      return new NextResponse(null, { status: 400 });
    }
  } catch (error) {
    console.error('Error while handling interaction', error);
    return new NextResponse(null, { status: 500 });
  }

  console.info('Successfully handled interaction, responding with 200');
  return new NextResponse(null, { status: 200 });
}
