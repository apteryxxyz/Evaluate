import {
  InteractionResponseType,
  InteractionType,
} from 'discord-api-types/v10';
import type { APIInteraction } from 'discord-api-types/v10';
import { verifyKey } from 'discord-interactions';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
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
  process.env.FUNCTION_START_TIMESTAMP = Date.now().toString();

  const body = await request.json();

  const buffer = Buffer.from(JSON.stringify(body));
  if (buffer.length === 0) return new NextResponse(null, { status: 400 });

  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  if (!signature || !timestamp) return new NextResponse(null, { status: 400 });

  const key = process.env.DISCORD_CLIENT_PUBLIC_KEY;
  if (!verifyKey(buffer, signature, timestamp, key))
    return new NextResponse(null, { status: 401 });

  const interaction = body as APIInteraction;

  try {
    if (interaction.type === InteractionType.Ping)
      return NextResponse.json({ type: InteractionResponseType.Pong });

    if (isChatInputCommand(interaction) || isAutocomplete(interaction)) {
      const command = chatInputCommands[interaction.data.name];
      if (!command) return new NextResponse(null, { status: 400 });

      if (isAutocomplete(interaction)) {
        if (!command.autocomplete)
          return new NextResponse(null, { status: 500 });
        await command.autocomplete(interaction);
        return new NextResponse(null, { status: 200 });
      } else {
        await command.handler(interaction);
        return new NextResponse(null, { status: 200 });
      }
    }

    if (isMessageMenuCommand(interaction)) {
      const command = messageMenuCommands[interaction.data.name];
      if (!command) return new NextResponse(null, { status: 400 });
      await command.handler(interaction);
      return new NextResponse(null, { status: 200 });
    }

    if (isModal(interaction)) {
      const component = modalComponents.find((c) => c.check(interaction));
      if (!component) return new NextResponse(null, { status: 400 });
      await component.handler(interaction);
      return new NextResponse(null, { status: 200 });
    }

    if (isButton(interaction)) {
      const component = buttonComponents.find((c) => c.check(interaction));
      if (!component) return new NextResponse(null, { status: 400 });
      await component.handler(interaction);
      return new NextResponse(null, { status: 200 });
    }

    if (isSelectMenu(interaction)) {
      const component = selectMenuComponents.find((c) => c.check(interaction));
      if (!component) return new NextResponse(null, { status: 400 });
      await component.handler(interaction);
      return new NextResponse(null, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(null, { status: 500 });
  }

  return new NextResponse(null, { status: 400 });
}
