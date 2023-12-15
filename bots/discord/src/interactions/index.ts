import { SlashCommandBuilder } from '@discordjs/builders';
import type { ChatInputCommand } from '~/builders/chat-input';

import captureChatInput from './capture/chat-input';
import evaluateChatInput from './evaluate/chat-input';
export const chatInputCommands = [captureChatInput, evaluateChatInput].reduce(
  (commands, command) => {
    const name = command.builder(new SlashCommandBuilder()).name ?? '';
    commands[name] = command;
    return commands;
  },
  {} as Record<string, ChatInputCommand>,
);

import captureModal from './capture/modal';
import evaluateModal from './evaluate/modal';
export const modalComponents = [captureModal, evaluateModal];

import { ApplicationCommandType } from 'discord-api-types/v10';
import evaluateButton from './evaluate/button';
export const buttonComponents = [evaluateButton];

if (process.env.NODE_ENV === 'development') {
  const commands = [];
  for (const command of [...Object.values(chatInputCommands)]) {
    const built =
      command.type === ApplicationCommandType.ChatInput
        ? command.builder(new SlashCommandBuilder())
        : undefined;
    if (built) commands.push(built.toJSON());
  }

  console.info('Writing commands to file');
  const { writeFile } = await import('node:fs/promises');
  await writeFile(
    './commands.json',
    JSON.stringify(commands, null, 2),
    'utf-8',
  );
}
