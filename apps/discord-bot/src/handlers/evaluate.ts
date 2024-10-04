import {
  type APIEmbedAuthor,
  CommandInteraction,
  Embed,
  ModalInteraction,
  Row,
  type User,
} from '@buape/carbon';
import { compress } from '@evaluate/engine/compress';
import { executeCode } from '@evaluate/engine/execute';
import {
  getRuntimeDefaultFileName,
  searchRuntimes,
} from '@evaluate/engine/runtimes';
import type { ExecuteResult, PartialRuntime } from '@evaluate/types';
import { EditEvaluationButton } from '~/components/edit-evaluation-button';
import { OpenEvaluationButton } from '~/components/open-evaluation-button';
import { env } from '~/env';
import analytics from '~/services/analytics';
import { codeBlock } from '~/utilities/discord-formatting';

function isNew(
  interaction: CommandInteraction | ModalInteraction,
): interaction is
  | CommandInteraction
  | (ModalInteraction & { rawData: { data: { custom_id: `evaluate:new` } } }) {
  return (
    interaction instanceof CommandInteraction ||
    interaction.rawData.data.custom_id === 'evaluate:new'
  );
}

function isEdit(
  interaction: CommandInteraction | ModalInteraction,
): interaction is ModalInteraction & {
  rawData: { data: { custom_id: `evaluate:edit` } };
} {
  return (
    interaction instanceof ModalInteraction &&
    interaction.rawData.data.custom_id === 'evaluate:edit'
  );
}

function compressOptions(options: {
  runtime: string | PartialRuntime;
  code: string;
  args?: string;
  input?: string;
}) {
  const identifier =
    typeof options.runtime === 'string' ? options.runtime : options.runtime.id;
  const fileName = getRuntimeDefaultFileName(identifier) ?? 'file.code';
  return compress({
    files: {
      [fileName]: options.code,
      '::input::': options.input,
      '::args::': options.args,
    },
    entry: fileName,
    focused: fileName,
  });
}

export async function handleEvaluating(
  interaction: CommandInteraction | ModalInteraction,
  options: { runtime: string; code: string; args?: string; input?: string },
) {
  if (
    interaction.rawData.message &&
    interaction.rawData.message.interaction_metadata?.user.id !==
      interaction.user?.id
  )
    Reflect.set(interaction.rawData.data, 'custom_id', 'evaluate:new');

  console.log('[EVALUATE] Handling evaluation', interaction, options);

  if (isNew(interaction)) {
    console.log('[EVALUATE] New');
    await interaction.defer();
    console.log('[EVALUATE] Deferred');
  } else if (isEdit(interaction)) {
    console.log('[EVALUATE] Edit');
    await interaction.acknowledge();
    console.log('[EVALUATE] Acknowledged');
  }

  const runtime = await searchRuntimes(options.runtime).then((r) => r[0]);
  if (!runtime) {
    const message =
      'I was unable to find the runtime you were looking for, try again with another name.';
    if (isNew(interaction)) return interaction.reply({ content: message });
    if (isEdit(interaction)) return interaction.followUp({ content: message });
    throw new Error(message);
  }

  const executeOptions = {
    files: { 'file.code': options.code },
    entry: 'file.code',
    input: options.input,
    args: options.args,
  };

  console.log('[EVALUATE] Executing code', executeOptions);
  const result = await executeCode({
    runtime: runtime.id,
    ...executeOptions,
  }).catch(async (error) => {
    if (error instanceof Error)
      await interaction.reply({ content: error.message });
    throw error;
  });
  console.log('[EVALUATE] Executed code', result);

  analytics?.capture({
    distinctId: interaction.userId!,
    event: 'code executed',
    properties: {
      platform: 'discord bot',
      'runtime id': runtime.id,
      'was successful':
        result.run.code === 0 && (!result.compile || result.compile.code === 0),
    },
  });

  const resultKey = result?.compile?.code ? 'compile' : 'run';
  const hasTimedOut = result[resultKey]?.signal === 'SIGKILL';
  const doesHaveDisplayableOutput = result[resultKey]?.output?.trim() !== '';

  let output = result[resultKey]!.output;
  if (!doesHaveDisplayableOutput) {
    const isRun = resultKey === 'run';
    if (hasTimedOut) {
      if (isRun)
        output =
          'Your code execution exceeded the allotted time and was terminated. Consider optimising it for better performance.';
      else
        output =
          'Your code compilation exceeded the allotted time and was terminated. Consider optimizing your code for faster compilation.';
    } else {
      output =
        'Your code executed successfully; however, it did not generate any output for the console.';
    }
  } else if (output.length > 1000) {
    output = `Output was too large to display, [click here to view the full output](${
      env.WEBSITE_URL
    }/playgrounds/${runtime.id}#${compressOptions(options)}).`;
  } else {
    output = codeBlock(output, 1000);
  }

  console.log('[EVALUATE] Replying with evaluation payload');
  return interaction.reply(
    createEvaluationPayload(
      interaction.user,
      { ...options, runtime },
      result,
      output,
    ),
  );
}

export function createEvaluationPayload(
  user: User | null,
  options: {
    runtime: PartialRuntime;
    code: string;
    input?: string;
    args?: string;
  },
  result: ExecuteResult,
  output: string,
) {
  const embed = new Embed({
    title: 'Code Evaluation',
    description: `**${options.runtime.name}**\n${codeBlock(options.runtime.aliases[0]!, options.code, 4000)}`,
    color:
      result.run.code === 0 && (!result.compile || result.compile.code === 0)
        ? 0x2fc086
        : 0xff0000,
    fields: [],
    author: user
      ? { name: user.username!, icon_url: user.avatarUrl! }
      : (undefined as unknown as APIEmbedAuthor),
  });

  if (options.args)
    embed.fields?.push({
      inline: true,
      name: 'CLI Arguments',
      value: codeBlock(options.args, 1000),
    });
  if (options.input)
    embed.fields?.push({
      inline: true,
      name: 'STD Input',
      value: codeBlock(options.input, 1000),
    });
  embed.fields?.push({
    name: 'Output',
    value: output,
  });

  return {
    embeds: [embed],
    components: [
      new Row([
        new EditEvaluationButton(),
        new OpenEvaluationButton(
          `${env.WEBSITE_URL}/playgrounds/${options.runtime.id}#${compressOptions(options)}`,
        ),
      ]),
    ],
  };
}
