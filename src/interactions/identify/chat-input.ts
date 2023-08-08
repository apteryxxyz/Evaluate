import { SlashCommandBuilder } from '@discordjs/builders';
import { createChatInputCommand } from '@/builders/command';
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
          .setRequired(true)
          .setMinLength(4)
          .setMaxLength(1000),
      ),

  async (interaction) => {
    return handleIdentifing(
      useTranslate(determineLocale(interaction)),
      interaction,
      { code: getOption<string>(interaction, 'code', true).value },
    );
  },
);
