import {
  type APIInteraction,
  type BaseInteraction,
  CommandInteraction,
  Embed,
  MessageFlags,
  type MessagePayload,
  ModalInteraction,
  Row,
} from '@buape/carbon';
import { makeEditCodePathname } from 'piston.ts/evaluate';
import { EditEvaluationButton } from '~/components/edit-evaluation-button.js';
import { OpenEvaluationButton } from '~/components/open-evaluation-button.js';
import env from '~/env.js';
import { codeBlock } from '~/helpers/discord-formatting.js';
import { resolveEmoji } from '~/helpers/resolve-emoji.js';
import { getInteractionContext } from '~/helpers/session-context.js';
import piston from '~/services/piston.js';
import { captureEvent } from '~/services/posthog.js';

//

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

//

export async function handleEvaluating(
  interaction: CommandInteraction | ModalInteraction,
  runtimeResolvable: string,
  options: Parameters<typeof piston.execute>[1],
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

  const runtime = await piston.runtimes
    .search(runtimeResolvable)
    .then((r) => r[0]);
  if (!runtime) {
    const message = interaction.say`I was unable to find the runtime you were looking for, try again with another name.`;
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

  const [executeResult, executeOptions] = await piston.execute(
    runtime,
    options,
  );

  captureEvent(getInteractionContext(interaction.rawData), 'executed_code', {
    runtime_id: runtime.id,
    code_length: executeOptions.length,
    code_lines: executeOptions.lines,
    compile_successful: executeResult.compile?.success ?? null,
    execution_successful: executeResult.success,
  });

  let output = executeResult.output;
  if (executeResult.compile?.expired)
    output = interaction.say`Your code compilation exceeded the allotted time and was terminated. Consider optimising your code for faster compilation.`;
  else if (executeResult.run.expired)
    output = interaction.say`Your code execution exceeded the allotted time and was terminated. Consider optimising it for better performance.`;
  else if (!output)
    output = interaction.say`Your code executed successfully; however, it did not generate any output for the console.`;
  else if (output.length > 900) {
    const url = new URL(
      makeEditCodePathname(runtime, executeOptions),
      env.WEBSITE_URL,
    );
    output = interaction.say`Output was too large to display, [click here to view the full output](${url}).`;
  } else output = codeBlock(output, 1000);

  return interaction.reply(
    createEvaluationPayload(
      interaction,
      runtime,
      executeOptions,
      executeResult,
      output,
    ),
  );
}

export function createEvaluationPayload(
  interaction: BaseInteraction<APIInteraction>,
  runtime: Parameters<typeof piston.execute>[0],
  options: Awaited<ReturnType<typeof piston.execute>>[1],
  result: Awaited<ReturnType<typeof piston.execute>>[0],
  output: string,
): MessagePayload {
  const embed = new Embed({
    title: interaction.say`Code Evaluation`,
    description: `**${runtime.name}** (v${runtime.version})\n${codeBlock(runtime.aliases[0]!, options.files[options.entry]!, 4000)}`,
    color: result.success ? 0x2fc086 : 0xff0000,
    fields: [],
    author: interaction.user
      ? {
          name: interaction.user.username!,
          icon_url: interaction.user.avatarUrl!,
        }
      : undefined,
  });

  if (options.files['::args::'])
    embed.fields?.push({
      inline: true,
      name: `${resolveEmoji('puzzle')} ${interaction.say`CLI Arguments`}`,
      value: codeBlock(options.files['::args::'], 1000),
    });
  if (options.files['::input::'])
    embed.fields?.push({
      inline: true,
      name: `${resolveEmoji('keyboard')} ${interaction.say`STDIN`}`,
      value: codeBlock(options.files['::input::'], 1000),
    });
  embed.fields?.push({
    name: `${resolveEmoji('printer')} ${interaction.say`Output`}`,
    value: output,
  });

  return {
    embeds: [embed],
    components: [
      new Row([
        new EditEvaluationButton(interaction.say),
        new OpenEvaluationButton(
          interaction.say,
          new URL(
            makeEditCodePathname(runtime, options),
            env.WEBSITE_URL,
          ).toString(),
        ),
      ]),
    ],
  };
}
