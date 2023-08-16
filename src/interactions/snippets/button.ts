import { PrismaClient } from '@prisma/client';
import { createButtonComponent } from '@/builders/component';
import { api } from '@/core';
import { handleEvaluating } from '@/functions/evaluate';
import { determineLocale } from '@/translate/functions';
import { useTranslate } from '@/translate/use';

export default createButtonComponent(
  (interaction) => interaction.data.custom_id.startsWith('snippets,'),

  async (interaction) => {
    const [, action, snippetId] = interaction.data.custom_id.split(',');
    const t = useTranslate(determineLocale(interaction));

    const prisma = new PrismaClient();

    if (action === 'run') {
      const snippet = await prisma.snippet //
        .findUnique({ where: { id: snippetId } });

      if (!snippet)
        return void (await api.interactions.reply(
          interaction.application_id,
          interaction.token,
          { content: t.snippets.view.unknown(), flags: 64 },
        ));

      return handleEvaluating('new', t, interaction, {
        ...snippet,
        input: snippet.input ?? undefined,
        args: snippet.args ?? undefined,
        static: true,
      });
    }

    if (action === 'delete') {
      // The snippet view is ephemeral so we don't need to ensure the user is the owner
      await prisma.snippet
        .delete({ where: { id: snippetId } })
        .catch(() => null);

      return api.interactions.updateMessage(interaction.id, interaction.token, {
        content: t.snippets.view.deleted(),
        components: [],
      });
    }
  },
);
