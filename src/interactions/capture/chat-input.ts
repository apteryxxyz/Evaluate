import { SlashCommandBuilder } from '@discordjs/builders';
import { createChatInputCommand } from '@/builders/command';
import { api } from '@/core';
import { createCaptureModal, handleCapturing } from '@/functions/capture';
import { determineLocale } from '@/translate/functions';
import { useTranslate } from '@/translate/use';
import { getOption } from '@/utilities/interaction-helpers';

export default createChatInputCommand(
  'capture',
  () =>
    new SlashCommandBuilder()
      .setName('t_capture_command_name')
      .setDescription('t_capture_command_description')
      .addStringOption((option) =>
        option
          .setName('t_capture_code_name')
          .setDescription('t_capture_code_description')
          .setMinLength(1)
          .setMaxLength(2000),
      )
      .addAttachmentOption((option) =>
        option
          .setName('t_capture_file_name')
          .setDescription('t_capture_file_description'),
      ),

  async (interaction) => {
    let code = getOption<string>(interaction.data, 'code')?.value;
    const file = getOption<string>(interaction.data, 'file')?.attachment;
    const t = useTranslate(determineLocale(interaction));

    if (file) {
      const large = () =>
        api.interactions.reply(
          interaction.id, //
          interaction.token,
          { content: t.capture.file.large() },
        );

      if (file.size > 4000) return large();
      const content = await fetch(file.url).then((r) => r.text());
      if (content.length > 4000) return large();
      code = content;
    }

    if (code) {
      return handleCapturing(t, interaction, code);
    } else {
      const modal = createCaptureModal(t, { code }).setCustomId('capture,new');
      return api.interactions.createModal(
        interaction.id,
        interaction.token,
        modal.toJSON(),
      );
    }
  },
);
