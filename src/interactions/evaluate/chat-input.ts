import { SlashCommandBuilder } from '@discordjs/builders';
import { createChatInputCommand } from '@/builders/command';
import { api } from '@/core';
import { createEvaluateModal, handleEvaluating } from '@/functions/evaluate';
import { determineLocale } from '@/translate/functions';
import { useTranslate } from '@/translate/use';
import { getOption } from '@/utilities/interaction-helpers';

export default createChatInputCommand(
  'evaluate',
  () =>
    new SlashCommandBuilder()
      .setName('t_evaluate_command_name')
      .setDescription('t_evaluate_command_description')
      .addStringOption((option) =>
        option
          .setName('t_evaluate_language_name')
          .setDescription('t_evaluate_language_description')
          .setMinLength(1)
          .setMaxLength(100),
      )
      .addStringOption((option) =>
        option
          .setName('t_evaluate_code_name')
          .setDescription('t_evaluate_code_description')
          .setMinLength(1)
          .setMaxLength(4000),
      )
      .addStringOption((option) =>
        option
          .setName('t_evaluate_input_name')
          .setDescription('t_evaluate_input_description')
          .setMinLength(1)
          .setMaxLength(500),
      )
      .addStringOption((option) =>
        option
          .setName('t_evaluate_args_name')
          .setDescription('t_evaluate_args_description')
          .setMinLength(1)
          .setMaxLength(500),
      ),

  async (interaction) => {
    const language = getOption<string>(interaction, 'language')?.value;
    const code = getOption<string>(interaction, 'code')?.value;
    const input = getOption<string>(interaction, 'input')?.value;
    const args = getOption<string>(interaction, 'arguments')?.value;

    const t = useTranslate(determineLocale(interaction));

    if (language && code) {
      const options = { language, code, input, args };
      return handleEvaluating('new', t, interaction, options);
    } else {
      const options = { language, code, input, args };
      const modal = createEvaluateModal(t, options).setCustomId('evaluate,new');
      return api.interactions.createModal(
        interaction.id,
        interaction.token,
        modal.toJSON(),
      );
    }
  },
);
