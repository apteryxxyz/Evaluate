import type { ContextMenuCommandBuilder } from '@discordjs/builders';
import type { APIMessageApplicationCommandInteraction } from '@discordjs/core';
import type { APIInteraction } from 'discord-api-types/v10';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { isCommand } from '.';

export interface MessageMenuCommand {
  name: string;
  builder: () => ContextMenuCommandBuilder;
  handler: (
    interaction: APIMessageApplicationCommandInteraction,
  ) => Promise<void>;
}

export function createMessageMenuCommand(
  name: string,
  builder: () => ContextMenuCommandBuilder,
  handler: (
    interaction: APIMessageApplicationCommandInteraction,
  ) => Promise<void>,
): MessageMenuCommand {
  return {
    name,
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
