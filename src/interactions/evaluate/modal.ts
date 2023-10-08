import _ from 'lodash';
import { createModalComponent } from '@/builders/component';
import { handleEvaluating } from '@/interactions/handlers/evaluate';
import { getTranslate } from '@/translations/determine-locale';
import { getField } from '@/utilities/interaction/interaction-helpers';

export default createModalComponent(
  (i) => i.data.custom_id.startsWith('evaluate,'),

  async (interaction) => {
    const [, action] = interaction.data.custom_id.split(',');
    const t = getTranslate(interaction);

    if (action === 'new' || action === 'edit')
      return handleEvaluating(action, t, interaction, {
        language: getField(interaction, 'language', true)?.value,
        code: getField(interaction, 'code', true)?.value,
        input: getField(interaction, 'input')?.value,
        args: getField(interaction, 'args')?.value,
      });
  },
);
