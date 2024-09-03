import { SlashCommandBuilder } from '@discordjs/builders';
import type { ChatInputCommand } from '~/builders/chat-input';

import evaluateChatInput from './evaluate/chat-input';
export const chatInputCommands = [evaluateChatInput].reduce(
  (commands, command) => {
    const name = command.builder(new SlashCommandBuilder()).name ?? '';
    commands[name] = command;
    return commands;
  },
  {} as Record<string, ChatInputCommand>,
);

//

import evaluateModal from './evaluate/modal';
export const modalComponents = [evaluateModal];

//

import evaluateButton from './evaluate/button';
export const buttonComponents = [evaluateButton];
