import { createChatInputCommand } from '@/builders/command';
import { api } from '@/core';
import {
  createCaptureModal,
  handleCapturing,
} from '@/interactions/handlers/capture';
import { getTranslate } from '@/translations/determine-locale';
import { applyLocalizations } from '@/translations/get-localizations';
import { getOption } from '@/utilities/interaction/interaction-helpers';

export default createChatInputCommand(
  (builder) =>
    applyLocalizations(builder, 'capture').addStringOption((option) =>
      applyLocalizations(option, 'capture.code').setMaxLength(2000),
    ),

  async (interaction) => {
    const code = getOption<string>(interaction.data, 'code')?.value;
    const t = getTranslate(interaction);

    if (code) {
      return handleCapturing(t, interaction, code);
    } else {
      const modal = createCaptureModal(t, { code }).setCustomId('capture,new');
      return api.interactions.createModal(
        interaction.id,
        interaction.token,
        modal.toJSON(),
      );
    }
  },
);
