import { determineLocale, getTranslate } from '@evaluate/translate';
import { createChatInputCommand } from '~/builders/chat-input';
import { api } from '~/core';
import { getOption } from '~/utilities/interaction-helpers';
import { applyLocalisations } from '~/utilities/localisation-helpers';
import { createEvaluateModal } from './_/builders';
import { handleEvaluating } from './_/handlers';

export default createChatInputCommand(
  (builder) =>
    applyLocalisations(builder, 'evaluate')
      .addStringOption((option) =>
        applyLocalisations(option, 'evaluate.language')
          .setMinLength(1)
          .setMaxLength(100),
      )
      .addStringOption((option) =>
        applyLocalisations(option, 'evaluate.code')
          .setMinLength(1)
          .setMaxLength(4000),
      )
      .addStringOption((option) =>
        applyLocalisations(option, 'evaluate.input')
          .setMinLength(1)
          .setMaxLength(4000),
      )
      .addStringOption((option) =>
        applyLocalisations(option, 'evaluate.args')
          .setMinLength(1)
          .setMaxLength(500),
      ),
  async (interaction) => {
    const language = getOption<string>(interaction.data, 'language')?.value;
    const code = getOption<string>(interaction.data, 'code')?.value;
    const input = getOption<string>(interaction.data, 'input')?.value;
    const args = getOption<string>(interaction.data, 'arguments')?.value;

    const t = getTranslate(determineLocale(interaction));

    if (language && code) {
      const options = { language, code, input, args };
      return handleEvaluating('new', t, interaction, options, {});
    } else {
      const options = { language, code, input, args };
      const modal = createEvaluateModal(t, options) //
        .setCustomId('evaluate,new');
      return api.interactions.createModal(
        interaction.id,
        interaction.token,
        modal.toJSON(),
      );
    }
  },
);
