import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
} from '@discordjs/builders';
import type { APIInteraction } from 'discord-api-types/v10';
import { ButtonStyle, TextInputStyle } from 'discord-api-types/v10';
import { api } from '@/core';
import { executeCode, findLanguage } from '@/services/piston';
import type { ExecuteCodeOptions, ExecuteCodeResult } from '@/services/piston';
import { codeBlock } from '@/utilities/interaction/discord-formatting';
import { resolveEmoji } from '@/utilities/interaction/resolve-emoji';
import type { TranslationFunctions } from '.translations';

interface HandleEvaluatingOptions {
  language: string;
  code: string;
  input?: string;
  args?: string;
  ephemeral?: boolean;
  static?: boolean;
}

export async function handleEvaluating(
  action: 'edit' | 'new',
  t: TranslationFunctions,
  interaction: APIInteraction,
  options: HandleEvaluatingOptions,
) {
  await api.interactions[action === 'edit' ? 'deferMessageUpdate' : 'defer'](
    interaction.id,
    interaction.token,
    options.ephemeral ? { flags: 64 } : undefined,
  );
  const language = await findLanguage(options.language);
  if (!language)
    return void (await api.interactions[
      action === 'new' ? 'editReply' : 'followUp'
    ](interaction.application_id, interaction.token, {
      content: t.evaluate.language.not_found(),
      flags: 64,
    }));

  const input = { ...options, language, files: [{ content: options.code }] };
  const result = await executeCode(input);

  let output;
  if (result.run.success === false) output = result.run.output;
  else if (result.compile?.success === false) output = result.compile.output;
  else output = result.run.output;

  if (!output.length) {
    output = t.evaluate.output.no_output();
  } else if (output.length > 1000) {
    const url = new URL(
      `/languages/${language.id}`,
      process.env.NEXT_PUBLIC_APP_URL,
    );

    url.searchParams.set('utm_source', 'discord');
    url.searchParams.set('utm_medium', 'bot');
    url.searchParams.set('utm_campaign', 'evaluate');
    url.searchParams.set('utm_content', 'output');
    url.searchParams.set('utm_term', 'too_long');

    url.searchParams.set('code', options.code);
    if (options.input) url.searchParams.set('input', options.input);
    if (options.args) url.searchParams.set('args', options.args);
    url.searchParams.set('run', 'true');
    output = t.evaluate.output.too_long({ url: url.toString() });
  } else {
    output = codeBlock(output, 1000);
  }

  return void (await api.interactions.editReply(
    interaction.application_id,
    interaction.token,
    createEvaluateResult(t, input, result, output, options),
  ));
}

export function createEvaluateResult(
  t: TranslationFunctions,
  input: ExecuteCodeOptions,
  result: ExecuteCodeResult,
  output: string,
  options: { static?: boolean },
) {
  const embed = new EmbedBuilder()
    .setTitle(t.evaluate())
    .setDescription(
      `**${input.language.name}** (${input.language.version})\n${codeBlock(
        input.language.key,
        input.files[0].content,
        4000,
      )}`,
    )
    .addFields(
      [
        input.input
          ? {
              inline: true,
              name: t.evaluate.input(),
              value: codeBlock(input.input, 1000),
            }
          : undefined,
        input.args
          ? {
              inline: true,
              name: t.evaluate.args(),
              value: codeBlock(input.args, 1000),
            }
          : undefined,
        { name: t.evaluate.output(), value: output },
      ].filter(Boolean),
    )
    .setColor(result.success ? 0x2fc086 : 0xff0000);

  const buttons = new ActionRowBuilder<ButtonBuilder>().setComponents(
    new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId('evaluate,edit')
      .setEmoji(resolveEmoji('edit', true)),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId('evaluate,save')
      .setEmoji(resolveEmoji('save', true))
      .setDisabled(!result.success),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId('evaluate,capture')
      .setEmoji(resolveEmoji('capture', true))
      .setDisabled(!result.success),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId('evaluate,explain')
      .setEmoji(resolveEmoji('explain', true))
      .setDisabled(result.success || output.includes('[pastebin]')),
  );

  return {
    embeds: [embed.toJSON()],
    components: options?.static ? undefined : [buttons.toJSON()],
  };
}

export function createEvaluateModal(
  t: TranslationFunctions,
  options?: Partial<{
    language: string;
    code: string;
    input: string;
    args: string;
  }>,
): { setCustomId: (id: string) => ModalBuilder } {
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
    .setRequired(false)
    .setPlaceholder(t.evaluate.input.description())
    .setMinLength(1)
    .setMaxLength(500);
  if (options?.input) inputInput.setValue(options.input);

  const argsInput = new TextInputBuilder()
    .setCustomId('args')
    .setStyle(TextInputStyle.Paragraph)
    .setLabel(t.evaluate.args())
    .setPlaceholder(t.evaluate.args.description())
    .setRequired(false)
    .setMinLength(1)
    .setMaxLength(500);
  if (options?.args) argsInput.setValue(options.args);

  return new ModalBuilder()
    .setTitle(t.evaluate())
    .setComponents(
      [languageInput, codeInput, inputInput, argsInput].map((input) =>
        new ActionRowBuilder<TextInputBuilder>().addComponents(input),
      ),
    );
}

export function createSaveModal(
  t: TranslationFunctions,
  options?: Partial<{ name: string }>,
) {
  const nameInput = new TextInputBuilder()
    .setCustomId('name')
    .setStyle(TextInputStyle.Short)
    .setLabel(t.snippets.name())
    .setPlaceholder(t.snippets.name.description())
    .setMinLength(1)
    .setMaxLength(25);
  if (options?.name) nameInput.setValue(options.name);

  return new ModalBuilder()
    .setTitle(t.snippets.save())
    .setComponents(
      new ActionRowBuilder<TextInputBuilder>().setComponents(nameInput),
    );
}
