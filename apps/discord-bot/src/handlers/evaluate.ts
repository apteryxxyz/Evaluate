import {
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
import type { ExecuteResult, PartialRuntime } from '@evaluate/shapes';
import { EditEvaluationButton } from '~/components/edit-evaluation-button';
import { OpenEvaluationButton } from '~/components/open-evaluation-button';
import env from '~/env';
import { captureEvent } from '~/services/posthog';
import { codeBlock } from '~/utilities/discord-formatting';
import { getInteractionContext } from '~/utilities/session-context';

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
  runtime: PartialRuntime;
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

  if (isNew(interaction)) await interaction.defer();
  if (isEdit(interaction)) await interaction.acknowledge();

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

  const result = await executeCode({
    runtime: runtime.id,
    ...executeOptions,
  }).catch(async (error) => {
    if (error instanceof Error)
      await interaction.reply({ content: error.message });
    throw error;
  });

  captureEvent(getInteractionContext(interaction.rawData), 'executed_code', {
    runtime_id: runtime.id,
    code_length: options.code.length,
    code_lines: options.code.split('\n').length,
    compile_successful: result.compile ? result.compile.code === 0 : null,
    execution_successful:
      result.run.code === 0 && (!result.compile || result.compile.code === 0),
  });

  const resultKey = result?.compile?.code ? 'compile' : 'run';
  const hasTimedOut = result[resultKey]?.signal === 'SIGKILL';
  const doesHaveDisplayableOutput = result[resultKey]?.output?.trim() !== '';

  let output = result[resultKey]!.output;
  if (!doesHaveDisplayableOutput) {
    // TODO: This stuff would be better handled by the executeCode function
    const isRun = resultKey === 'run';
    if (hasTimedOut) {
      if (isRun)
        output =
          'Your code execution exceeded the allotted time and was terminated. Consider optimising it for better performance.';
      else
        output =
          'Your code compilation exceeded the allotted time and was terminated. Consider optimising your code for faster compilation.';
    } else {
      output =
        'Your code executed successfully; however, it did not generate any output for the console.';
    }
  } else if (output.length > 1000) {
    output = `Output was too large to display, [click here to view the full output](${
      env.WEBSITE_URL
    }/playgrounds/${runtime.id}#${compressOptions({ ...options, runtime })}).`;
  } else {
    output = codeBlock(output, 1000);
  }

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
      : undefined,
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
          `${env.WEBSITE_URL}playgrounds/${options.runtime.id}#${compressOptions(options)}`,
        ),
      ]),
    ],
  };
}
