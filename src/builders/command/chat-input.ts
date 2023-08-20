import type { SlashCommandBuilder } from '@discordjs/builders';
import type {
  APIApplicationCommandAutocompleteInteraction,
  APIChatInputApplicationCommandInteraction,
  APIInteraction,
} from 'discord-api-types/v10';
import { ApplicationCommandType, InteractionType } from 'discord-api-types/v10';
import { isCommand } from '.';

export interface ChatInputCommand {
  type: ApplicationCommandType.ChatInput;
  builder: (
    builder: SlashCommandBuilder,
  ) => Partial<SlashCommandBuilder> & Pick<SlashCommandBuilder, 'toJSON'>;
  autocomplete?: (
    interaction: APIApplicationCommandAutocompleteInteraction,
  ) => Promise<void>;
  handler: (
    interaction: APIChatInputApplicationCommandInteraction,
  ) => Promise<void>;
}

export function createChatInputCommand(
  builder: ChatInputCommand['builder'],
  handler: ChatInputCommand['handler'],
  autocomplete?: ChatInputCommand['autocomplete'],
) {
  return {
    type: ApplicationCommandType.ChatInput,
    builder,
    autocomplete,
    handler,
  } satisfies ChatInputCommand;
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
