import { PrismaClient } from '@prisma/client';
import _ from 'lodash';
import { createModalComponent, isMessageModal } from '@/builders/component';
import { api } from '@/core';
import { handleEvaluating } from '@/interactions/handlers/evaluate';
import { getTranslate } from '@/translations/determine-locale';
import { getEvaluateOptions } from '@/utilities/interaction/evaluate-helpers';
import { getField, getUser } from '@/utilities/interaction/interaction-helpers';

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

    if (action === 'save' && isMessageModal(interaction)) {
      await api.interactions.defer(interaction.id, interaction.token, {
        flags: 64,
      });

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
          { content: t.snippets.save.reached_max() },
        ));

      const embed = interaction.message.embeds.at(0)!;
      const data = {
        name: getField(interaction, 'name', true).value,
        // Only pick the fields that are relevant to the snippet, errors otherwise
        ..._.pick(getEvaluateOptions(t, embed), [
          'language',
          'code',
          'input',
          'args',
        ]),
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
          { content: t.snippets.save.already_exists() },
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
        { content: t.snippets.save.success({ snippet_name: data.name }) },
      ));
    }
  },
);
