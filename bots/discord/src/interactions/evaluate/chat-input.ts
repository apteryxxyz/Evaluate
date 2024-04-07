import { createChatInputCommand } from '~/builders/chat-input';
import { api } from '~/core';
import { getOption } from '~/utilities/interaction-helpers';
import { createEvaluateModal } from './_/builders';
import { handleEvaluating } from './_/handlers';

export default createChatInputCommand(
  (builder) =>
    builder
      .setName('evaluate')
      .setDescription(
        'Evaluate any piece of code in any runtime with optional input and command line arguments.',
      )
      .addStringOption((option) =>
        option
          .setName('runtime')
          .setDescription('The runtime in which the code is written.'),
      )
      .addStringOption((option) =>
        option.setName('code').setDescription('The source code to evaluate.'),
      )
      .addStringOption((option) =>
        option
          .setName('input')
          .setDescription('The STDIN input to provide to the program.')
          .setRequired(false),
      )
      .addStringOption((option) =>
        option
          .setName('arguments')
          .setDescription(
            'Additional command line arguments to pass to the program.',
          )
          .setRequired(false),
      ),

  async (interaction) => {
    const runtime = getOption<string>(interaction.data, 'runtime')?.value;
    const code = getOption<string>(interaction.data, 'code')?.value;
    const input = getOption<string>(interaction.data, 'input')?.value;
    const args = getOption<string>(interaction.data, 'arguments')?.value;
    const data = { runtime, code, input, args };

    if (runtime && code) {
      return handleEvaluating('new', interaction, data as never);
    } else {
      const modal = createEvaluateModal(data).setCustomId('evaluate,new');
      return api.interactions.createModal(
        interaction.id,
        interaction.token,
        modal.toJSON(),
      );
    }
  },
);
