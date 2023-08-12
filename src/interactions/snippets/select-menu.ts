import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from '@discordjs/builders';
import { PrismaClient } from '@prisma/client';
import { ButtonStyle } from 'discord-api-types/v10';
import { createSelectMenuComponent } from '@/builders/component';
import { api } from '@/core';
import { findLanguage } from '@/services/piston';
import { determineLocale } from '@/translate/functions';
import { useTranslate } from '@/translate/use';
import { codeBlock } from '@/utilities/discord-formatting';
import { resolveEmoji } from '@/utilities/resolve-emoji';

export default createSelectMenuComponent(
  (i) => i.data.custom_id.startsWith('snippets,'),

  async (interaction) => {
    const [, action] = interaction.data.custom_id.split(',');
    const t = useTranslate(determineLocale(interaction));

    if (action === 'choose') {
      await api.interactions.defer(interaction.id, interaction.token, {
        flags: 64,
      });

      const prisma = new PrismaClient();

      const snippetId = interaction.data.values[0];
      const snippet = await prisma.snippet //
        .findUnique({ where: { id: snippetId } });
      if (!snippet)
        return void (await api.interactions.editReply(
          interaction.application_id,
          interaction.token,
          { content: t.snippets.view.unknown() },
        ));

      const language = (await findLanguage(snippet.language))!;

      const embed = new EmbedBuilder()
        .setTitle(t.snippets.view.title(snippet))
        .setDescription(
          `**${language.name}** (${language.version})\n${codeBlock(
            language.key,
            snippet.code,
            4000,
          )}`,
        )
        .addFields(
          [
            snippet.input
              ? {
                  inline: true,
                  name: t.evaluate.input.name(),
                  value: snippet.input,
                }
              : undefined,
            snippet.args
              ? {
                  inline: true,
                  name: t.evaluate.args.name(),
                  value: snippet.args,
                }
              : undefined,
          ].filter(Boolean),
        )
        .setColor(0x2fc086);

      const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setCustomId(`snippets,run,${snippet.id}`)
          .setEmoji(resolveEmoji('run', true)),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setCustomId(`snippets,delete,${snippet.id}`)
          .setEmoji(resolveEmoji('delete', true)),
      );

      return void (await api.interactions.editReply(
        interaction.application_id,
        interaction.token,
        { embeds: [embed.toJSON()], components: [buttons.toJSON()], flags: 64 },
      ));
    }
  },
);
