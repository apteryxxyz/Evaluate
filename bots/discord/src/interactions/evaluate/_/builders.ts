import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
} from '@discordjs/builders';
import { compress } from '@evaluate/engine/compress';
import type { ExecuteResult, PartialRuntime } from '@evaluate/types';
import { ButtonStyle, TextInputStyle } from 'discord-api-types/v10';
import { env } from '~/env';
import { codeBlock } from '~/utilities/discord-formatting';
import { resolveEmoji } from '~/utilities/resolve-emoji';

export function createEvaluateModal(
  options: Partial<{
    runtime: string;
    code: string;
    input: string;
    args: string;
  }> = {},
) {
  const runtimeInput = new TextInputBuilder()
    .setCustomId('runtime')
    .setStyle(TextInputStyle.Short)
    .setLabel('Runtime')
    .setPlaceholder('The runtime in which the code is written.')
    .setMinLength(1)
    .setMaxLength(100);
  if (options?.runtime) runtimeInput.setValue(options.runtime);

  const codeInput = new TextInputBuilder()
    .setCustomId('code')
    .setStyle(TextInputStyle.Paragraph)
    .setLabel('Code')
    .setPlaceholder('Ths source code to evaluate.')
    .setMinLength(1)
    .setMaxLength(4000);
  if (options?.code) codeInput.setValue(options.code);

  const argsInput = new TextInputBuilder()
    .setCustomId('args')
    .setStyle(TextInputStyle.Paragraph)
    .setLabel('Arguments')
    .setPlaceholder('Additional command line arguments to pass to the program.')
    .setMinLength(1)
    .setMaxLength(500)
    .setRequired(false);
  if (options?.args) argsInput.setValue(options.args);

  const inputInput = new TextInputBuilder()
    .setCustomId('input')
    .setStyle(TextInputStyle.Paragraph)
    .setLabel('Input')
    .setPlaceholder('The STDIN input to provide to the program.')
    .setMinLength(1)
    .setMaxLength(500)
    .setRequired(false);
  if (options?.input) inputInput.setValue(options.input);

  return new ModalBuilder().setTitle('Evaluate').setComponents(
    [runtimeInput, codeInput, argsInput, inputInput] //
      .map((i) => new ActionRowBuilder<TextInputBuilder>().addComponents(i)),
  );
}

export function createEvaluateResult(
  runtime: PartialRuntime,
  options: { code: string; input?: string; args?: string },
  result: ExecuteResult,
  output: string,
  { embedOnly = false }: { embedOnly?: boolean },
) {
  const embed = new EmbedBuilder()
    .setTitle('Evaluate')
    .setDescription(
      `**${runtime.name}**\n${codeBlock(
        runtime.aliases[0]!,
        options.code,
        4000,
      )}`,
    )
    .setColor(
      result.run.code === 0 && (!result.compile || result.compile.code === 0)
        ? 0x2fc086
        : 0xff0000,
    );

  if (options.args)
    embed.addFields({
      inline: true,
      name: 'CLI Arguments',
      value: codeBlock(options.args, 1000),
    });
  if (options.input)
    embed.addFields({
      inline: true,
      name: 'STD Input',
      value: codeBlock(options.input, 1000),
    });
  embed.addFields({
    name: 'Output',
    value: output,
  });

  if (embedOnly) return { embeds: [embed.toJSON()] };

  const buttons = new ActionRowBuilder<ButtonBuilder>().setComponents(
    new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId('evaluate,edit')
      .setEmoji(resolveEmoji('pencil', true)),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setEmoji(resolveEmoji('globe', true))
      .setURL(
        `${env.WEBSITE_URL}/playgrounds/${runtime.id}#${compress({
          files: { 'file.code': options.code },
          entry: 'file.code',
          input: options.input,
          args: options.args,
        })}`,
      ),
  );

  return {
    embeds: [embed.toJSON()],
    components: [buttons.toJSON()],
  };
}
