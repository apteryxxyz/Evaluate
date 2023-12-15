import { determineLocale, getTranslate } from '@evaluate/translate';
import { createButtonComponent } from '~/builders/button';
import { api } from '~/core';
import { getEvaluateOptions } from '~/utilities/evaluate-helpers';
import { getUser } from '~/utilities/interaction-helpers';
import { createCaptureModal } from '../capture/_/builders';
import { createEvaluateModal } from './_/builders';

export default createButtonComponent(
  (i) => i.data.custom_id.startsWith('evaluate,'),

  async (interaction) => {
    const t = getTranslate(determineLocale(interaction));

    if (getUser(interaction)?.id !== interaction.message?.interaction?.user?.id)
      return api.interactions.reply(interaction.id, interaction.token, {
        content: t.evaluate.unauthorised(),
        flags: 64,
      });

    const [, action] = interaction.data.custom_id.split(',');

    if (action === 'edit') {
      const embed = interaction.message.embeds[0]!;
      const options = getEvaluateOptions(t, embed);

      const modal = createEvaluateModal(t, options) //
        .setCustomId('evaluate,edit');

      return api.interactions.createModal(
        interaction.id,
        interaction.token,
        modal.toJSON(),
      );
    }

    if (action === 'capture') {
      const embed = interaction.message.embeds[0]!;
      const options = getEvaluateOptions(t, embed);
      const modal = createCaptureModal(t, options) //
        .setCustomId('capture,new');

      return api.interactions.createModal(
        interaction.id,
        interaction.token,
        modal.toJSON(),
      );
    }
  },
);
