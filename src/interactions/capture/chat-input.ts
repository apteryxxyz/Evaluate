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
      ),

  async (interaction) => {
    const code = getOption<string>(interaction, 'code')?.value;
    const t = useTranslate(determineLocale(interaction));

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
