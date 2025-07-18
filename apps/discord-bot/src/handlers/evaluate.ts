import {
  CommandInteraction,
  Embed,
  MessageFlags,
  ModalInteraction,
  Row,
  type User,
} from '@buape/carbon';
import { executeCode } from '@evaluate/engine/execute';
import {
  getRuntimeDefaultFileName,
  searchRuntimes,
} from '@evaluate/engine/runtimes';
import type { ExecuteResult, PartialRuntime } from '@evaluate/shapes';
import { EditEvaluationButton } from '~/components/edit-evaluation-button.js';
import { OpenEvaluationButton } from '~/components/open-evaluation-button.js';
import { captureEvent } from '~/services/posthog.js';
import { codeBlock } from '~/utilities/discord-formatting.js';
import { makeEditCodeUrl } from '~/utilities/make-url.js';
import { getInteractionContext } from '~/utilities/session-context.js';

function isNew(
  interaction: CommandInteraction | ModalInteraction,
): interaction is
  | CommandInteraction
  | (ModalInteraction & { rawData: { data: { custom_id: `evaluate,new` } } }) {
  return (
    interaction instanceof CommandInteraction ||
    interaction.rawData.data.custom_id === 'evaluate,new'
  );
}

function isEdit(
  interaction: CommandInteraction | ModalInteraction,
): interaction is ModalInteraction & {
  rawData: { data: { custom_id: `evaluate,edit` } };
} {
  return (
    interaction instanceof ModalInteraction &&
    interaction.rawData.data.custom_id === 'evaluate,edit'
  );
}

export async function handleEvaluating(
  interaction: CommandInteraction | ModalInteraction,
  options: { runtime: string; code: string; args?: string; input?: string },
) {
  // HACK: If trying to edit an existing evaluation owned by another user, create new instead
  if (
    interaction.rawData.message &&
    interaction.rawData.message.interaction_metadata?.user.id !==
      interaction.user?.id
  )
    Reflect.set(interaction.rawData.data, 'custom_id', 'evaluate,new');

  if (isNew(interaction)) await interaction.defer();
  if (isEdit(interaction)) await interaction.acknowledge();

  const runtime = await searchRuntimes(options.runtime).then((r) => r[0]);
  if (!runtime) {
    const message =
      'I was unable to find the runtime you were looking for, try again with another name.';
    if (isNew(interaction))
      return interaction.reply({
        content: message,
        flags: MessageFlags.Ephemeral,
      });
    if (isEdit(interaction))
      return interaction.followUp({
        content: message,
        flags: MessageFlags.Ephemeral,
      });
    throw new Error(message);
  }

  const fileName = getRuntimeDefaultFileName(runtime.id) ?? 'file.code';
  const executeOptions = {
    files: { [fileName]: options.code },
    entry: fileName,
    input: options.input,
    args: options.args,
  };

  const result = await executeCode({
    runtime: runtime.id,
    ...executeOptions,
  }).catch(async (error) => {
    if (error instanceof Error)
      await interaction.reply({
        content: error.message,
        flags: MessageFlags.Ephemeral,
      });
    throw error;
  });

  captureEvent(getInteractionContext(interaction.rawData), 'executed_code', {
    runtime_id: runtime.id,
    code_length: options.code.length,
    code_lines: options.code.split('\n').length,
    compile_successful: result.compile?.success ?? null,
    execution_successful: result.success,
  });

  let output = result.output;
  if (result.compile?.expired)
    output =
      'Your code compilation exceeded the allotted time and was terminated. Consider optimising your code for faster compilation.';
  else if (result.run.expired)
    output =
      'Your code execution exceeded the allotted time and was terminated. Consider optimising it for better performance.';
  else if (!output)
    output =
      'Your code executed successfully; however, it did not generate any output for the console.';
  else if (output.length > 900)
    output = `Output was too large to display, [click here to view the full output](${makeEditCodeUrl(options)})`;
  else output = codeBlock(output, 1000);

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
    color: result.success ? 0x2fc086 : 0xff0000,
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
          makeEditCodeUrl({ ...options, runtime: options.runtime.id }),
        ),
      ]),
    ],
  };
}
