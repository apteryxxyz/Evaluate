import type {
  APIApplicationCommandInteraction,
  APIInteraction,
} from 'discord-api-types/v10';
import { InteractionType } from 'discord-api-types/v10';
import type { ChatInputCommand } from './chat-input';
import type { MessageMenuCommand } from './message-menu';

export * from './chat-input';
export * from './message-menu';

export function isCommand(
  interaction: APIInteraction,
): interaction is APIApplicationCommandInteraction {
  return interaction.type === InteractionType.ApplicationCommand;
}

export type Command = ChatInputCommand | MessageMenuCommand;
