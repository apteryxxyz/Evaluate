import { createModalComponent, isMessageModal } from '@/builders/component';
import { api } from '@/core';
import { handleCapturing } from '@/interactions/handlers/capture';
import { getTranslate } from '@/translations/determine-locale';
import { getField } from '@/utilities/interaction/interaction-helpers';

export default createModalComponent(
  (i) => i.data.custom_id.startsWith('capture,'),

  async (interaction) => {
    if (isMessageModal(interaction)) {
      // To prevent duplicating the captures, we disable the button
      const row = interaction.message.components![0];
      const newComponents = row.components //
        // * The capture button is the third button
        .map((c, i) => (i === 2 ? { disabled: true, ...c } : c));
      row.components = newComponents;
      void api.channels.editMessage(
        interaction.channel!.id,
        interaction.message.id,
        { components: [row] },
      );
    }

    const t = getTranslate(interaction);
    const code = getField(interaction, 'code', true).value;
    return handleCapturing(t, interaction, code);
  },
);
