import { ActionRowBuilder, StringSelectMenuBuilder } from '@discordjs/builders';
import { PrismaClient } from '@prisma/client';
import { createChatInputCommand } from '@/builders/command';
import { api } from '@/core';
import { getTranslate } from '@/translations/determine-locale';
import { applyLocalizations } from '@/translations/get-localizations';
import { getUser } from '@/utilities/interaction/interaction-helpers';

export default createChatInputCommand(
  (builder) => applyLocalizations(builder, 'snippets'),

  async (interaction) => {
    await api.interactions.defer(interaction.id, interaction.token, {
      flags: 64,
    });

    const t = getTranslate(interaction);

    const prisma = new PrismaClient();

    const userId = getUser(interaction).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { snippets: true },
    });

    if (!user || !user.snippets.length)
      return void (await api.interactions.editReply(
        interaction.application_id,
        interaction.token,
        { content: t.snippets.list.none() },
      ));

    const menu = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
      new StringSelectMenuBuilder()
        .setCustomId('snippets,choose')
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder(t.snippets.list.placeholder())
        .setOptions(
          user.snippets.map((s) => ({
            label: s.name,
            value: s.id,
          })),
        ),
    );

    return void (await api.interactions.editReply(
      interaction.application_id,
      interaction.token,
      { components: [menu.toJSON()] },
    ));
  },
);
