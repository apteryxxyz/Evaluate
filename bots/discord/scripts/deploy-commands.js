#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { API } from '@discordjs/core/http-only';
import { REST } from '@discordjs/rest';
import env from '@next/env';

void main(process.argv.length, process.argv);
async function main(_argc, _argv) {
  const commands = await readFile('./commands.json', 'utf-8')//
    .then((data) => JSON.parse(data));

  env.loadEnvConfig('./', process.env.NODE_ENV !== 'production');
  const rest = new REST({ version: '10' }) //
    .setToken(process.env.DISCORD_TOKEN);
  const api = new API(rest);

  console.info('Deploying commands...');
  console.info(commands.map((c) => c.name).join(', '));
  await api.applicationCommands //
    .bulkOverwriteGlobalCommands(process.env.DISCORD_CLIENT_ID, commands);
  console.info('Done!');
}
