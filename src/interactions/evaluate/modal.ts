import { createModalComponent, isMessageModal } from '@/builders/component';
import { api } from '@/core';
import { handleEvaluating } from '@/functions/evaluate';
import { determineLocale } from '@/translate/functions';
import { useTranslate } from '@/translate/use';
import {
  getBolds,
  getCodeBlocks,
  getEmbedField,
} from '@/utilities/discord-helpers';
import { getField, getUser } from '@/utilities/interaction-helpers';

export default createModalComponent(
  (i) => i.data.custom_id.startsWith('evaluate,'),

  async (interaction) => {
    const [, action] = interaction.data.custom_id.split(',');
    const t = useTranslate(determineLocale(interaction));

    if (action === 'new' || action === 'edit')
      return handleEvaluating(action, t, interaction, {
        language: getField(interaction, 'language', true)?.value,
        code: getField(interaction, 'code', true)?.value,
        input: getField(interaction, 'input')?.value,
        args: getField(interaction, 'args')?.value,
      });

    if (action === 'save' && isMessageModal(interaction)) {
      await api.interactions.defer(interaction.id, interaction.token, {
        flags: 64,
      });

      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      const userId = getUser(interaction).id;
      const user = await prisma.user.upsert({
        where: { id: userId },
        create: { id: userId },
        update: {},
        include: { snippets: true },
      });

      if (user.snippets.length >= 25)
        return void (await api.interactions.editReply(
          interaction.application_id,
          interaction.token,
          { content: t.snippets.save.maximum() },
        ));

      const embed = interaction.message.embeds.at(0)!;
      const data = {
        name: getField(interaction, 'name', true).value,
        language: getBolds(embed.description ?? '').at(0)!,
        code: getCodeBlocks(embed.description ?? '').at(0)!.code,
        input: getEmbedField(embed, t.evaluate.input.name())?.value,
        args: getEmbedField(embed, t.evaluate.args.name())?.value,
      };

      const isExisting = user.snippets.some(
        (snippet) =>
          snippet.language === data.language &&
          snippet.code === data.code &&
          snippet.input == data.input &&
          snippet.args == data.args,
      );
      if (isExisting)
        return void (await api.interactions.editReply(
          interaction.application_id,
          interaction.token,
          { content: t.snippets.save.exists() },
        ));

      await prisma.snippet.create({
        data: {
          ...data,
          id: `${interaction.message.id}-${Date.now()}`,
          userId,
        },
      });

      return void (await api.interactions.editReply(
        interaction.application_id,
        interaction.token,
        { content: t.snippets.save.success(data) },
      ));
    }
  },
);
