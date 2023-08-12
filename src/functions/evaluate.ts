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
import { createPaste } from '@/services/dpaste';
import { executeCode, findLanguage } from '@/services/piston';
import type { ExecuteCodeResult } from '@/services/piston';
import { codeBlock } from '@/utilities/discord-formatting';
import { resolveEmoji } from '@/utilities/resolve-emoji';
import type { TranslationFunctions } from '.translations';

export async function handleEvaluating(
  action: 'edit' | 'new',
  t: TranslationFunctions,
  interaction: APIInteraction,
  options: {
    language: string;
    code: string;
    input?: string;
    args?: string;
    ephemeral?: boolean;
  },
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
      content: t.evaluate.language.unknown(),
      flags: 64,
    }));

  const result = await executeCode({ ...options, language });
  const output = await (async () => {
    if (result.output.length === 0) return t.evaluate.output.empty();
    else if (result.output.length > 2000) {
      const url = await createPaste({ content: result.output });
      return t.evaluate.output.pastebin({ url });
    } else return codeBlock(result.output, 1000);
  })();

  return void (await api.interactions.editReply(
    interaction.application_id,
    interaction.token,
    createEvaluateResult(t, result, output),
  ));
}

export function createEvaluateResult(
  t: TranslationFunctions,
  result: ExecuteCodeResult,
  output: string,
) {
  const embed = new EmbedBuilder()
    .setTitle(t.evaluate.result.title())
    .setDescription(
      `**${result.language.name}** (${result.language.version})\n${codeBlock(
        result.language.key,
        result.code,
        4000,
      )}`,
    )
    .addFields(
      [
        result.input
          ? {
              inline: true,
              name: t.evaluate.input.name(),
              value: codeBlock(result.input, 1000),
            }
          : undefined,
        result.args
          ? {
              inline: true,
              name: t.evaluate.args.name(),
              value: codeBlock(result.args, 1000),
            }
          : undefined,
        { name: t.evaluate.output.name(), value: output },
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

  return { embeds: [embed.toJSON()], components: [buttons.toJSON()] };
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
    .setLabel(t.evaluate.language.name())
    .setPlaceholder(t.evaluate.language.placeholder())
    .setMinLength(1)
    .setMaxLength(100);
  if (options?.language) languageInput.setValue(options.language);

  const codeInput = new TextInputBuilder()
    .setCustomId('code')
    .setStyle(TextInputStyle.Paragraph)
    .setLabel(t.evaluate.code.name())
    .setPlaceholder(t.evaluate.code.placeholder())
    .setMinLength(1)
    .setMaxLength(4000);
  if (options?.code) codeInput.setValue(options.code);

  const inputInput = new TextInputBuilder()
    .setCustomId('input')
    .setStyle(TextInputStyle.Paragraph)
    .setLabel(t.evaluate.input.name())
    .setRequired(false)
    .setPlaceholder(t.evaluate.input.placeholder())
    .setMinLength(1)
    .setMaxLength(500);
  if (options?.input) inputInput.setValue(options.input);

  const argsInput = new TextInputBuilder()
    .setCustomId('args')
    .setStyle(TextInputStyle.Paragraph)
    .setLabel(t.evaluate.args.name())
    .setPlaceholder(t.evaluate.args.placeholder())
    .setRequired(false)
    .setMinLength(1)
    .setMaxLength(500);
  if (options?.args) argsInput.setValue(options.args);

  return new ModalBuilder()
    .setTitle(t.evaluate.command.name())
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
    .setLabel(t.snippets.name.name())
    .setPlaceholder(t.snippets.name.placeholder())
    .setMinLength(1)
    .setMaxLength(25);
  if (options?.name) nameInput.setValue(options.name);

  return new ModalBuilder()
    .setTitle(t.snippets.save.title())
    .setComponents(
      new ActionRowBuilder<TextInputBuilder>().setComponents(nameInput),
    );
}
