import { compress } from '@evaluate/engine/compress';
import { executeCode } from '@evaluate/engine/execute';
import { searchRuntimes } from '@evaluate/engine/runtimes';
import type { APIInteraction } from 'discord-api-types/v10';
import { api } from '~/core';
import { env } from '~/env';
import analytics from '~/services/analytics';
import { codeBlock } from '~/utilities/discord-formatting';
import { getUser } from '~/utilities/interaction-helpers';
import { createEvaluateResult } from './builders';

export async function handleEvaluating(
  action: 'edit' | 'new',
  interaction: APIInteraction,
  options: { runtime: string; code: string; input?: string; args?: string },
) {
  await api.interactions[action === 'edit' ? 'deferMessageUpdate' : 'defer'](
    interaction.id,
    interaction.token,
  );

  const runtime = await searchRuntimes(options.runtime) //
    .then((runtimes) => runtimes[0]);
  if (!runtime)
    return api.interactions[action === 'new' ? 'editReply' : 'followUp'](
      interaction.application_id,
      interaction.token,
      {
        content:
          'Was unable to resolve the runtime you are looking for, try again with a different name.',
      },
    );

  const executeOptions = {
    files: { 'file.code': options.code },
    entry: 'file.code',
    input: options.input,
    args: options.args,
  };
  const result = await executeCode({ runtime: runtime.id, ...executeOptions });

  analytics?.capture({
    distinctId: getUser(interaction)?.id!,
    event: 'code executed',
    properties: {
      platform: 'discord bot',
      'runtime id': runtime.id,
      'was successful':
        result.run.code === 0 && (!result.compile || result.compile.code === 0),
    },
  });

  const resultKey = result?.compile?.code ? 'compile' : 'run';
  let output = result?.[resultKey]!.output;

  if (!output.length) {
    output =
      'No output was returned from the evaluation, ensure something is being printed to the console.';
  } else if (output.length > 1000) {
    output = `Output was too large to display, [click here to view the full output](${
      env.WEBSITE_URL
    }/playgrounds/${runtime.id}#${compress(executeOptions)}).`;
  } else {
    output = codeBlock(output, 1000);
  }

  return api.interactions.editReply(
    interaction.application_id,
    interaction.token,
    createEvaluateResult(runtime, options, result, output, {}),
  );
}
