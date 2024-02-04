import { determineLocale, getTranslate } from '@evaluate/translate';
import { createChatInputCommand } from '~/builders/chat-input';
import { api } from '~/core';
import { getOption } from '~/utilities/interaction-helpers';
import { applyLocalisations } from '~/utilities/localisation-helpers';
import { createCaptureModal } from './_/builders';
import { handleCapturing } from './_/handlers';

export default createChatInputCommand(
  (builder) =>
    applyLocalisations(builder, [
      'capture',
      'capture.description',
    ]).addStringOption((option) =>
      applyLocalisations(option, [
        'capture.code',
        'capture.code.description',
      ]).setMaxLength(2000),
    ),

  async (interaction) => {
    const code = getOption<string>(interaction.data, 'code')?.value;
    const t = getTranslate(determineLocale(interaction));

    if (code) {
      return handleCapturing(interaction, code);
    } else {
      const modal = createCaptureModal(t, { code }) //
        .setCustomId('capture,new');
      return api.interactions.createModal(
        interaction.id,
        interaction.token,
        modal.toJSON(),
      );
    }
  },
);
