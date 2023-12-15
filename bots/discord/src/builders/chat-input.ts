import { SlashCommandBuilder } from '@discordjs/builders';
import {
  APIApplicationCommandAutocompleteInteraction,
  APIChatInputApplicationCommandInteraction,
  APIInteraction,
  ApplicationCommandType,
  InteractionType,
} from 'discord-api-types/v10';

export interface ChatInputCommand {
  type: ApplicationCommandType.ChatInput;
  builder(
    builder: SlashCommandBuilder,
  ): Partial<SlashCommandBuilder> & Pick<SlashCommandBuilder, 'toJSON'>;
  autocomplete?(
    interaction: APIApplicationCommandAutocompleteInteraction,
  ): Promise<unknown>;
  handler(
    interaction: APIChatInputApplicationCommandInteraction,
  ): Promise<unknown>;
}

/**
 * Create a new chat input command.
 * @param builder the slash command builder
 * @param handler function that handles the interaction
 * @param autocomplete function that handles autocomplete interactions
 * @returns a new chat input command
 */
export function createChatInputCommand(
  builder: ChatInputCommand['builder'],
  handler: ChatInputCommand['handler'],
  autocomplete?: ChatInputCommand['autocomplete'],
): ChatInputCommand {
  return {
    type: ApplicationCommandType.ChatInput,
    builder,
    handler,
    autocomplete,
  };
}

/**
 * Check if an interaction is a chat input command.
 * @param interaction the interaction to check
 * @returns whether the interaction is a chat input command
 */
export function isChatInputCommand(
  interaction: APIInteraction,
): interaction is APIChatInputApplicationCommandInteraction {
  return (
    interaction.type === InteractionType.ApplicationCommand &&
    interaction.data.type === ApplicationCommandType.ChatInput
  );
}

/**
 * Check if an interaction is an autocomplete interaction.
 * @param interaction the interaction to check
 * @returns whether the interaction is an autocomplete interaction
 */
export function isAutocomplete(
  interaction: APIInteraction,
): interaction is APIApplicationCommandAutocompleteInteraction {
  return interaction.type === InteractionType.ApplicationCommandAutocomplete;
}
