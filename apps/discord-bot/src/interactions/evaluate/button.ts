import { createButtonComponent } from '~/builders/button';
import { api } from '~/core';
import { getEvaluateOptions } from '~/utilities/evaluate-helpers';
import { getUser } from '~/utilities/interaction-helpers';
import { createEvaluateModal } from './_/builders';

export default createButtonComponent(
  (i) => i.data.custom_id.startsWith('evaluate,'),

  (interaction) => {
    if (
      getUser(interaction)?.id !== interaction.message?.interaction?.user.id
    ) {
      return api.interactions.reply(interaction.id, interaction.token, {
        content: "This is not your evaluation, you'll need to create your own.",
        flags: 64,
      });
    }

    const [, action] = interaction.data.custom_id.split(',');

    if (action === 'edit') {
      const embed = interaction.message.embeds[0]!;
      const options = getEvaluateOptions(embed);

      const modal = createEvaluateModal(options).setCustomId('evaluate,edit');
      return api.interactions.createModal(
        interaction.id,
        interaction.token,
        modal.toJSON(),
      );
    }

    throw new Error(`Unknown action: ${action}`);
  },
);
