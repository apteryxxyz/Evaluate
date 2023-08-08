import {
  ActionRowBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from '@discordjs/builders';
import { createChatInputCommand } from '@/builders/command';
import { api } from '@/core';
import { determineLocale } from '@/translate/functions';
import { useTranslate } from '@/translate/use';
import { getUser } from '@/utilities/interaction-helpers';

export default createChatInputCommand(
  'snippets',
  () =>
    new SlashCommandBuilder()
      .setName('t_snippets_command_name')
      .setDescription('t_snippets_command_description'),

  async (interaction) => {
    await api.interactions.defer(interaction.id, interaction.token, {
      flags: 64,
    });

    const t = useTranslate(determineLocale(interaction));

    const { PrismaClient } = await import('@prisma/client');
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
