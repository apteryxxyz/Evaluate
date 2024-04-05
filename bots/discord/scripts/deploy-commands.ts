import { SlashCommandBuilder } from '@discordjs/builders';
import { api } from '~/core';
import { env } from '~/env';
import { chatInputCommands } from '~/interactions';

void main(process.argv.length, process.argv);
async function main(_argc: number, _argv: string[]) {
  if (!env.DISCORD_CLIENT_ID)
    return console.error(
      'No client ID found in environment variables, not deploying commands.',
    );

  console.info('Deploying commands...');
  const commands = Object.values(chatInputCommands) //
    .map((c) => c.builder(new SlashCommandBuilder()).toJSON());
  await api.applicationCommands //
    .bulkOverwriteGlobalCommands(env.DISCORD_CLIENT_ID, commands);
  console.info('Done!');
}
