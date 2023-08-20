import { createButtonComponent } from '@/builders/component';
import { api } from '@/core';
import { createCaptureModal } from '@/interactions/handlers/capture';
import {
  createEvaluateModal,
  createSaveModal,
} from '@/interactions/handlers/evaluate';
import { handleExplaining } from '@/interactions/handlers/explain';
import { getTranslate } from '@/translations/determine-locale';
import { getEvaluateOptions } from '@/utilities/interaction/evaluate-helpers';
import { getUser } from '@/utilities/interaction/interaction-helpers';

export default createButtonComponent(
  (i) => i.data.custom_id.startsWith('evaluate,'),

  async (interaction) => {
    const t = getTranslate(interaction);

    if (getUser(interaction).id !== interaction.message?.interaction?.user?.id)
      return api.interactions.reply(interaction.id, interaction.token, {
        content: t.evaluate.unauthorised(),
        flags: 64,
      });

    const [, action] = interaction.data.custom_id.split(',');

    if (action === 'edit') {
      const embed = interaction.message.embeds.at(0)!;
      const options = getEvaluateOptions(t, embed);

      const modal = createEvaluateModal(t, options) //
        .setCustomId('evaluate,edit');

      return api.interactions.createModal(
        interaction.id,
        interaction.token,
        modal.toJSON(),
      );
    }

    if (action === 'save') {
      const modal = createSaveModal(t).setCustomId('evaluate,save');

      return api.interactions.createModal(
        interaction.id,
        interaction.token,
        modal.toJSON(),
      );
    }

    if (action === 'capture') {
      const embed = interaction.message.embeds.at(0)!;
      const options = getEvaluateOptions(t, embed);
      const modal = createCaptureModal(t, options).setCustomId('capture,new');

      return api.interactions.createModal(
        interaction.id,
        interaction.token,
        modal.toJSON(),
      );
    }

    if (action === 'explain') {
      // To prevent duplicating the explains, we disable the button
      const row = interaction.message.components![0];
      const newComponents = row.components //
        // * The explain button is the fourth button
        .map((c, i) => (i === 3 ? { disabled: true, ...c } : c));
      row.components = newComponents;
      await api.channels.editMessage(
        interaction.channel.id,
        interaction.message.id,
        { components: [row] },
      );

      const embed = interaction.message.embeds.at(0)!;
      const options = getEvaluateOptions(t, embed);
      return handleExplaining(t, interaction, {
        ...options,
        output: options.output ?? '',
      });
    }
  },
);
