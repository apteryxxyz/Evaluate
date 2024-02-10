import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
} from '@discordjs/builders';
import { compress } from '@evaluate/compress';
import type { ExecuteCodeOptions, ExecuteCodeResult } from '@evaluate/execute';
import { TranslateFunctions } from '@evaluate/translate';
import { ButtonStyle, TextInputStyle } from 'discord-api-types/v10';
import { codeBlock } from '~/utilities/discord-formatting';
import { resolveEmoji } from '~/utilities/resolve-emoji';

/**
 * Build the evaluate modal.
 * @param t the translate functions to handle localisation
 * @param options the options to prefill the modal with
 * @returns the modal builder
 */
export function createEvaluateModal(
  t: TranslateFunctions,
  options?: Partial<{
    language: string;
    code: string;
    input: string;
    args: string;
  }>,
) {
  const languageInput = new TextInputBuilder()
    .setCustomId('language')
    .setStyle(TextInputStyle.Short)
    .setLabel(t.evaluate.language())
    .setPlaceholder(t.evaluate.language.description())
    .setMinLength(1)
    .setMaxLength(100);
  if (options?.language) languageInput.setValue(options.language);

  const codeInput = new TextInputBuilder()
    .setCustomId('code')
    .setStyle(TextInputStyle.Paragraph)
    .setLabel(t.evaluate.code())
    .setPlaceholder(t.evaluate.code.description())
    .setMinLength(1)
    .setMaxLength(4000);
  if (options?.code) codeInput.setValue(options.code);

  const inputInput = new TextInputBuilder()
    .setCustomId('input')
    .setStyle(TextInputStyle.Paragraph)
    .setLabel(t.evaluate.input())
    .setPlaceholder(t.evaluate.input.description())
    .setMinLength(1)
    .setMaxLength(500)
    .setRequired(false);
  if (options?.input) inputInput.setValue(options.input);

  const argsInput = new TextInputBuilder()
    .setCustomId('arguments')
    .setStyle(TextInputStyle.Paragraph)
    .setLabel(t.evaluate.args())
    .setPlaceholder(t.evaluate.args.description())
    .setMinLength(1)
    .setMaxLength(500)
    .setRequired(false);
  if (options?.args) argsInput.setValue(options.args);

  return new ModalBuilder().setTitle(t.evaluate()).setComponents(
    [languageInput, codeInput, inputInput, argsInput] //
      .map((i) => new ActionRowBuilder<TextInputBuilder>().addComponents(i)),
  );
}

/**
 * Build the evaluate result message payload.
 * @param t the translate functions to handle localisation
 * @param options the execute code options that were used
 * @param result the execute code result
 * @param output formatted result output
 * @param settings additional settings
 * @returns the message payload
 */
export function createEvaluateResult(
  t: TranslateFunctions,
  options: ExecuteCodeOptions,
  result: ExecuteCodeResult,
  output: string,
  settings: { static?: boolean } = {},
) {
  const embed = new EmbedBuilder()
    .setTitle(t.evaluate())
    .setDescription(
      `**${options.language.name}** (${options.language.version})\n` +
        codeBlock(options.language.key, options.files[0]!.content, 4000),
    )
    .setColor(result.success ? 0x2fc086 : 0xff0000);

  if (options.input)
    embed.addFields({
      inline: true,
      name: t.evaluate.input(),
      value: codeBlock(options.input, 1000),
    });
  if (options.args)
    embed.addFields({
      inline: true,
      name: t.evaluate.args(),
      value: codeBlock(options.args, 1000),
    });
  embed.addFields({
    name: t.evaluate.output(),
    value: output,
  });

  if (settings.static) return { embeds: [embed.toJSON()] };

  // const externalLink = result

  const url = new URL(
    `/languages/${options.language.id}`,
    process.env.WEBSITE_URL,
  );
  const data = compress({
    files: [{ content: options.files[0]!.content }],
    input: options.input ?? '',
    args: options.args ?? '',
  });
  url.searchParams.set('d', data);
  url.searchParams.set('utm_source', 'discord_bot');
  url.searchParams.set('utm_content', 'open_in_website');

  const buttons = new ActionRowBuilder<ButtonBuilder>().setComponents(
    new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId('evaluate,edit')
      .setEmoji(resolveEmoji('pencil', true)),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId('evaluate,capture')
      .setEmoji(resolveEmoji('camera', true))
      .setDisabled(!result.success),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setEmoji(resolveEmoji('globe', true))
      .setURL(url.toString()),
  );

  return {
    embeds: [embed.toJSON()],
    components: [buttons.toJSON()],
  };
}
