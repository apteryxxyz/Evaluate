import {
  type APIEmbedAuthor,
  CommandInteraction,
  Embed,
  ModalInteraction,
  Row,
  type User,
} from '@buape/carbon';
import { compress } from '@evaluate/engine/compress';
import type { ExecuteResult, PartialRuntime } from '@evaluate/types';
import { EditEvaluationButton } from '~/components/edit-evaluation-button';
import { OpenEvaluationButton } from '~/components/open-evaluation-button';
import { env } from '~/env';
import { codeBlock } from '~/utilities/discord-formatting';
import { executeCode } from '../../../../packages/engine/dist/execute';
import { searchRuntimes } from '../../../../packages/engine/dist/runtimes';

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
  const result = await executeCode({ runtime: runtime.id, ...executeOptions });

  const resultKey = result?.compile?.code ? 'compile' : 'run';
  let output = result?.[resultKey]!.output;
  if (!output.length) {
    output =
      'No output was returned from the evaluation, ensure something is being printed to the console.';
  } else if (output.length > 1000) {
    output = `Output was too large to display, [click here to view the full output](${
      env.WEBSITE_URL
    }/playgrounds/${runtime.id}#${compress(options)}).`;
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
          `${env.WEBSITE_URL}/playgrounds/${options.runtime.id}#${compress({
            files: { 'file.code': options.code },
            entry: 'file.code',
            input: options.input,
            args: options.args,
          })}`,
        ),
      ]),
    ],
  };
}
