import { SlashCommandBuilder } from '@discordjs/builders';
import { createChatInputCommand } from '@/builders/command';
import { api } from '@/core';
import { handleIdentifing } from '@/functions/identify';
import { determineLocale } from '@/translate/functions';
import { useTranslate } from '@/translate/use';
import { getOption } from '@/utilities/interaction-helpers';

export default createChatInputCommand(
  'identify',
  () =>
    new SlashCommandBuilder()
      .setName('t_identify_command_name')
      .setDescription('t_identify_command_description')
      .addStringOption((option) =>
        option
          .setName('t_identify_code_name')
          .setDescription('t_identify_code_description')
          .setMinLength(4)
          .setMaxLength(1000),
      )
      .addAttachmentOption((option) =>
        option
          .setName('t_identify_file_name')
          .setDescription('t_identify_file_description'),
      ),

  async (interaction) => {
    let code = getOption<string>(interaction, 'code')?.value;
    const file = getOption<string>(interaction, 'file')?.attachment;
    const t = useTranslate(determineLocale(interaction));

    if (file) {
      const large = () =>
        api.interactions.reply(
          interaction.id, //
          interaction.token,
          { content: t.capture.file.large() },
        );

      if (file.size > 1000) return large();
      const content = await fetch(file.url).then((r) => r.text());
      if (content.length > 1000) return large();
      code = content;
    }

    return handleIdentifing(
      useTranslate(determineLocale(interaction)),
      interaction,
      { code: [code ?? ''] },
    );
  },
);
