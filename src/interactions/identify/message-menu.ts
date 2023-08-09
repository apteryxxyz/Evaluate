import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { createMessageMenuCommand } from '@/builders/command';
import { api } from '@/core';
import { handleIdentifing } from '@/functions/identify';
import { determineLocale } from '@/translate/functions';
import { useTranslate } from '@/translate/use';
import { getCodeBlocks } from '@/utilities/discord-helpers';

export default createMessageMenuCommand(
  'Identify Code',
  () =>
    new ContextMenuCommandBuilder()
      .setType(ApplicationCommandType.Message)
      .setName('t_identify_message_name'),
  async (interaction) => {
    const t = useTranslate(determineLocale(interaction));

    const targetId = interaction.data.target_id;
    const targetMessage = interaction.data.resolved.messages[targetId];

    let codeBlocks = getCodeBlocks(targetMessage.content);
    if (codeBlocks.length === 0)
      codeBlocks = [{ language: undefined, code: targetMessage.content }];

    const hasTooLong = codeBlocks.some((block) => block.code.length > 1000);
    if (hasTooLong)
      return api.interactions.reply(interaction.id, interaction.token, {
        content: t.identify.code.long(),
        flags: 64,
      });

    return handleIdentifing(t, interaction, {
      code: codeBlocks.map((b) => b.code),
      ephemeral: true,
    });
  },
);
