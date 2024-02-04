import { createModalComponent, isMessageModal } from '~/builders/modal';
import { api } from '~/core';
import { getField } from '~/utilities/interaction-helpers';
import { handleCapturing } from './_/handlers';

export default createModalComponent(
  (i) => i.data.custom_id.startsWith('capture,'),

  async (interaction) => {
    if (isMessageModal(interaction)) {
      // To prevent duplicating the captures, we disable the button
      const row = interaction.message.components![0]!;
      const newComponents = row.components //
        // The capture button is the second button
        .map((c, i) => (i === 1 ? { disabled: true, ...c } : c));
      row.components = newComponents;
      void api.channels.editMessage(
        interaction.channel!.id,
        interaction.message.id,
        { components: [row] },
      );
    }

    const code = getField(interaction, 'code', true).value;
    return handleCapturing(interaction, code);
  },
);
