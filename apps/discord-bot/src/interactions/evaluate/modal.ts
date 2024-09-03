import { createModalComponent } from '~/builders/modal';
import { getField } from '~/utilities/interaction-helpers';
import { handleEvaluating } from './_/handlers';

export default createModalComponent(
  (i) => i.data.custom_id.startsWith('evaluate,'),

  (interaction) => {
    const [, action] = interaction.data.custom_id.split(',');

    if (action === 'new' || action === 'edit')
      return handleEvaluating(action, interaction, {
        runtime: getField(interaction, 'runtime', true)?.value,
        code: getField(interaction, 'code', true)?.value,
        input: getField(interaction, 'input')?.value,
        args: getField(interaction, 'args')?.value,
      });

    throw new Error(`Unknown action: ${action}`);
  },
);
