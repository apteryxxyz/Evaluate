import type { SlashCommandBuilder } from '@discordjs/builders';
import type {
  APIApplicationCommandAutocompleteInteraction,
  APIChatInputApplicationCommandInteraction,
  APIInteraction,
} from 'discord-api-types/v10';
import { ApplicationCommandType, InteractionType } from 'discord-api-types/v10';
import { isCommand } from '.';

export interface ChatInputCommand {
  name: string;
  builder: () => Partial<SlashCommandBuilder> &
    Pick<SlashCommandBuilder, 'toJSON'>;
  autocomplete?: (
    interaction: APIApplicationCommandAutocompleteInteraction,
  ) => Promise<void>;
  handler: (
    interaction: APIChatInputApplicationCommandInteraction,
  ) => Promise<void>;
}

export function createChatInputCommand(
  name: string,
  builder: ChatInputCommand['builder'],
  handler: ChatInputCommand['handler'],
  autocomplete?: ChatInputCommand['autocomplete'],
) {
  return { name, builder, autocomplete, handler } satisfies ChatInputCommand;
}

export function isChatInputCommand(
  interaction: APIInteraction,
): interaction is APIChatInputApplicationCommandInteraction {
  return (
    isCommand(interaction) &&
    interaction.data.type === ApplicationCommandType.ChatInput
  );
}

export function isAutocomplete(
  interaction: APIInteraction,
): interaction is APIApplicationCommandAutocompleteInteraction {
  return interaction.type === InteractionType.ApplicationCommandAutocomplete;
}
