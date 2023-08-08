import { createButtonComponent } from '@/builders/component';
import { api } from '@/core';
import { createCaptureModal } from '@/functions/capture';
import { createEvaluateModal, createSaveModal } from '@/functions/evaluate';
import { determineLocale } from '@/translate/functions';
import { useTranslate } from '@/translate/use';
import {
  getBolds,
  getCodeBlocks,
  getEmbedField,
} from '@/utilities/discord-helpers';
import { getUser } from '@/utilities/interaction-helpers';

export default createButtonComponent(
  (i) => i.data.custom_id.startsWith('evaluate,'),

  async (interaction) => {
    const t = useTranslate(determineLocale(interaction));

    if (getUser(interaction).id !== interaction.message?.interaction?.user?.id)
      return api.interactions.reply(interaction.id, interaction.token, {
        content: t.evaluate.unauthorised(),
        flags: 64,
      });

    const [, action] = interaction.data.custom_id.split(',');

    if (action === 'edit') {
      const embed = interaction.message.embeds.at(0)!;
      const modal = createEvaluateModal(t, {
        language: getBolds(embed.description ?? '').at(0),
        code: getCodeBlocks(embed.description ?? '').at(0)?.code,
        input: getEmbedField(embed, t.evaluate.input.name())?.value,
        args: getEmbedField(embed, t.evaluate.args.name())?.value,
      }).setCustomId('evaluate,edit');

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
      const modal = createCaptureModal(t, {
        code: getCodeBlocks(embed.description ?? '').at(0)?.code,
      }).setCustomId('capture,new');

      return api.interactions.createModal(
        interaction.id,
        interaction.token,
        modal.toJSON(),
      );
    }
  },
);
