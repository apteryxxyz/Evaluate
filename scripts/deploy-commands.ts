import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import _ from 'lodash';
import { api } from '@/core';
import { chatInputCommands, messageMenuCommands } from '@/interactions';
import { getLocalizations } from '@/translate/functions';

const execAsync = promisify(exec);

void main(process.argv.length, process.argv);
async function main(_argc: number, _argv: string[]) {
  const { stdout: branch } = await execAsync('git rev-parse --abbrev-ref HEAD');
  if (branch.trim() !== 'main') throw new Error('Not on main branch');

  const commands = [];
  for (const command of [
    ...Object.values(chatInputCommands),
    ...Object.values(messageMenuCommands),
  ]) {
    const built = command.builder().toJSON();
    const body = built as unknown as Record<string, unknown>;
    commands.push(replaceValues(body, Number(built.type) > 1));
  }

  console.info('Deploying commands...');
  console.info(commands.map((c) => c['name']).join(', '));
  await api.applicationCommands.bulkOverwriteGlobalCommands(
    process.env.DISCORD_CLIENT_ID,
    commands as never,
  );
  console.info('Deployed commands!');
}

function replaceValues(
  parent: Record<string, unknown>,
  isMenu = false,
): Record<string, unknown> {
  if (typeof parent !== 'object' || parent === null) return parent;

  for (const string of ['name', 'description'] as const) {
    if (string in parent && typeof parent[string] === 'string') {
      const value = parent[string] as string;
      if (!value.startsWith('t_')) continue;

      const key = value.split('_').slice(1).join('.');
      let localizations = getLocalizations(key);
      if (string === 'name' && !isMenu)
        localizations = _.mapValues(localizations, (v) => v.toLowerCase());

      parent[string] = localizations['en-GB'];
      parent[`${string}_localizations`] = _.omit(localizations, 'en-GB');
    }
  }

  if ('options' in parent && Array.isArray(parent['options']))
    for (const option of parent['options'] as Record<string, unknown>[])
      replaceValues(option);

  if ('choices' in parent && Array.isArray(parent['choices']))
    for (const choice of parent['choices'] as Record<string, unknown>[])
      replaceValues(choice);

  return parent;
}
