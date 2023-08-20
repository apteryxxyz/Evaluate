/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */

import {
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
} from '@discordjs/builders';
import type { ChatInputCommand, MessageMenuCommand } from '@/builders/command';
import type {
  ButtonComponent,
  ModalComponent,
  SelectMenuComponent,
} from '@/builders/component';

export const chatInputCommands = (
  [
    require('./capture/chat-input').default,
    require('./evaluate/chat-input').default,
    require('./identify/chat-input').default,
    require('./snippets/chat-input').default,
  ] as ChatInputCommand[]
).reduce(
  (commands, command) => {
    commands[command.builder(new SlashCommandBuilder()).name!] = command;
    return commands;
  },
  {} as Record<string, ChatInputCommand>,
);

export const messageMenuCommands = ([] as MessageMenuCommand[]).reduce(
  (commands, command) => {
    commands[command.builder(new ContextMenuCommandBuilder()).name] = command;
    return commands;
  },
  {} as Record<string, MessageMenuCommand>,
);

export const modalComponents = [
  require('./capture/modal').default,
  require('./evaluate/modal').default,
] as ModalComponent[];

export const buttonComponents = [
  require('./evaluate/button').default,
  require('./snippets/button').default,
] as ButtonComponent[];

export const selectMenuComponents = [
  require('./snippets/select-menu').default,
] as SelectMenuComponent[];
