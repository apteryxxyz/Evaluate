import {
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
} from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types/v10';
import _ from 'lodash';
import { api } from '@/core';
import { chatInputCommands, messageMenuCommands } from '@/interactions';

void main(process.argv.length, process.argv);
async function main(_argc: number, _argv: string[]) {
  if (process.env.VERCEL_ENV !== 'production') {
    console.info('Skipping command deployment because not in production.');
    return;
  }

  const commands = [];
  for (const command of [
    ...Object.values(chatInputCommands),
    ...Object.values(messageMenuCommands),
  ]) {
    const built =
      command.type === ApplicationCommandType.ChatInput
        ? command.builder(new SlashCommandBuilder())
        : command.builder(new ContextMenuCommandBuilder());
    commands.push(built.toJSON());
  }

  console.info('Deploying commands...');

  console.info(commands.map((c) => c.name).join(', '));
  await api.applicationCommands.bulkOverwriteGlobalCommands(
    process.env.DISCORD_CLIENT_ID,
    commands as never,
  );
  console.info('Deployed commands!');
}
