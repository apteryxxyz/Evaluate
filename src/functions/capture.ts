import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
} from '@discordjs/builders';
import type { APIInteraction } from 'discord-api-types/v10';
import { TextInputStyle } from 'discord-api-types/v10';
import { api } from '@/core';
import * as carbon from '@/services/carbon';
import * as code2img from '@/services/code2img';
import { isFulfilled } from '@/utilities/better-promise';
import type { TranslationFunctions } from '.translations';

export async function handleCapturing(
  t: TranslationFunctions,
  interaction: APIInteraction,
  code: string,
) {
  await api.interactions.defer(interaction.id, interaction.token);

  /**
   * We prefer Carbonara, however it can take a while to respond.
   * Vercel functions are limited to 10 seconds, and as such we
   * use Code 2 Img as a backup service.
   */

  const options = { code, theme: 'default' as const };
  const carbonPromise = carbon.generateCodeImage(options);
  const code2imgPromise = code2img.generateCodeImage(options);

  const startedAt = Number(process.env.FUNCTION_START_TIMESTAMP);
  const timeAvailable = 10_000 - (Date.now() - startedAt) - 500;
  await Promise.race([
    carbonPromise,
    new Promise((resolve) => setTimeout(resolve, timeAvailable)),
  ]);

  let imageBuffer;
  let isBackup = false;
  if (isFulfilled(carbonPromise)) {
    imageBuffer = await carbonPromise;
  } else if (isFulfilled(code2imgPromise)) {
    imageBuffer = await code2imgPromise;
    isBackup = true;
  }

  const messagePayload = { content: '', files: [] };
  if (imageBuffer)
    messagePayload.files.push({
      contentType: 'image/png',
      name: 'evaluate.png',
      data: imageBuffer,
    } as unknown as never);
  if (isBackup) messagePayload.content = t.capture.backup();
  if (!imageBuffer) messagePayload.content = t.capture.down();

  return void (await api.interactions.editReply(
    interaction.application_id,
    interaction.token,
    messagePayload,
  ));
}

export function createCaptureModal(
  t: TranslationFunctions,
  options?: Partial<{ code: string }>,
): { setCustomId: (id: string) => ModalBuilder } {
  const codeInput = new TextInputBuilder()
    .setCustomId('code')
    .setStyle(TextInputStyle.Paragraph)
    .setLabel(t.capture.code.name())
    .setPlaceholder(t.capture.code.placeholder())
    .setMinLength(1)
    .setMaxLength(2000);
  if (options?.code) codeInput.setValue(options.code);

  return new ModalBuilder()
    .setTitle(t.capture.command.name())
    .setComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(codeInput),
    );
}
