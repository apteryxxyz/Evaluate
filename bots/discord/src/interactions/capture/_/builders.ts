import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
} from '@discordjs/builders';
import { TranslateFunctions } from '@evaluate/translate';
import { TextInputStyle } from 'discord-api-types/v10';

/**
 * Build the capture modal.
 * @param t the translate functions to handle localisation
 * @param options the options to prefill the modal with
 * @return the modal builder
 */
export function createCaptureModal(
  t: TranslateFunctions,
  options?: Partial<{ code: string }>,
) {
  const codeInput = new TextInputBuilder()
    .setCustomId('code')
    .setStyle(TextInputStyle.Paragraph)
    .setLabel(t.capture.code())
    .setPlaceholder(t.capture.code.description())
    .setMinLength(1)
    .setMaxLength(2000);
  if (options?.code) codeInput.setValue(options.code);

  return new ModalBuilder()
    .setTitle(t.capture())
    .setComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(codeInput),
    );
}
