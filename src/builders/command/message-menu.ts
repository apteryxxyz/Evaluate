import type { ContextMenuCommandBuilder } from '@discordjs/builders';
import type {
  APIInteraction,
  APIMessageApplicationCommandInteraction,
} from 'discord-api-types/v10';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { isCommand } from '.';

export interface MessageMenuCommand {
  type: ApplicationCommandType.Message;
  builder: (builder: ContextMenuCommandBuilder) => ContextMenuCommandBuilder;
  handler: (
    interaction: APIMessageApplicationCommandInteraction,
  ) => Promise<void>;
}

export function createMessageMenuCommand(
  builder: MessageMenuCommand['builder'],
  handler: MessageMenuCommand['handler'],
): MessageMenuCommand {
  return {
    type: ApplicationCommandType.Message,
    builder,
    handler,
  };
}

export function isMessageMenuCommand(
  interaction: APIInteraction,
): interaction is APIMessageApplicationCommandInteraction {
  return (
    isCommand(interaction) &&
    interaction.data.type === ApplicationCommandType.Message
  );
}
