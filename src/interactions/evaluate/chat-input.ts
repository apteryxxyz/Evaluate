import { createChatInputCommand } from '@/builders/command';
import { api } from '@/core';
import {
  createEvaluateModal,
  handleEvaluating,
} from '@/interactions/handlers/evaluate';
import { getTranslate } from '@/translations/determine-locale';
import { applyLocalizations } from '@/translations/get-localizations';
import { getOption } from '@/utilities/interaction/interaction-helpers';

export default createChatInputCommand(
  (builder) =>
    applyLocalizations(builder, 'evaluate')
      .addStringOption((option) =>
        applyLocalizations(option, 'evaluate.language')
          .setMinLength(1)
          .setMaxLength(100),
      )
      .addStringOption((option) =>
        applyLocalizations(option, 'evaluate.code')
          .setMinLength(1)
          .setMaxLength(4000),
      )
      .addStringOption((option) =>
        applyLocalizations(option, 'evaluate.input')
          .setMinLength(1)
          .setMaxLength(500),
      )
      .addStringOption((option) =>
        applyLocalizations(option, 'evaluate.args')
          .setMinLength(1)
          .setMaxLength(500),
      ),
  async (interaction) => {
    const language = getOption<string>(interaction.data, 'language')?.value;
    const code = getOption<string>(interaction.data, 'code')?.value;
    const input = getOption<string>(interaction.data, 'input')?.value;
    const args = getOption<string>(interaction.data, 'arguments')?.value;

    const t = getTranslate(interaction);

    if (language && code) {
      const options = { language, code, input, args };
      return handleEvaluating('new', t, interaction, options);
    } else {
      const options = { language, code, input, args };
      const modal = createEvaluateModal(t, options).setCustomId('evaluate,new');
      return api.interactions.createModal(
        interaction.id,
        interaction.token,
        modal.toJSON(),
      );
    }
  },
);
