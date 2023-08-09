import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import _ from 'lodash';
import { api } from '@/core';
import { chatInputCommands, messageMenuCommands } from '@/interactions';
import { getLocalizations } from '@/translate/functions';

void main();
async function main() {
  const commands = [];
  for (const rawCommand of [
    ...Object.values(chatInputCommands),
    ...Object.values(messageMenuCommands),
  ]) {
    const command = replaceValues(rawCommand.builder().toJSON());
    commands.push(command);
  }

  console.info('Deploying commands...');
  await api.applicationCommands.bulkOverwriteGlobalCommands(
    process.env.DISCORD_CLIENT_ID,
    commands as RESTPostAPIApplicationCommandsJSONBody[],
  );
}

function replaceValues(value: unknown) {
  if (typeof value !== 'object' || value === null) return value;
  const object = value as Record<string, unknown>;

  for (const string of ['name', 'description'] as const) {
    if (string in object && typeof object[string] === 'string') {
      const value = object[string] as string;
      if (!value.startsWith('t_')) continue;

      const key = value.split('_').slice(1).join('.');
      let localizations = getLocalizations(key);
      if (string === 'name')
        localizations = _.mapValues(localizations, (v) => v.toLowerCase());

      object[string] = localizations['en-GB'];
      object[`${string}_localizations`] = _.omit(localizations, 'en-GB');
    }
  }

  if ('options' in object && Array.isArray(object['options']))
    for (const option of object['options'] as Record<string, unknown>[])
      replaceValues(option);

  if ('choices' in object && Array.isArray(object['choices']))
    for (const choice of object['choices'] as Record<string, unknown>[])
      replaceValues(choice);

  return object;
}
