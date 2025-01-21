import {
  ApplicationCommandOptionType,
  Command,
  type CommandInteraction,
  type CommandOptions,
} from '@buape/carbon';
import { EditEvaluationButton } from '~/components/edit-evaluation-button';
import { EvaluateModal, EvaluateModalEdit } from '~/components/evaluate-modal';
import { handleEvaluating } from '~/handlers/evaluate';

export class EvaluateCommand extends Command {
  name = 'evaluate';
  description =
    'Evaluate any piece of code in any runtime with optional input and command line arguments.';
  options: CommandOptions = [
    {
      type: ApplicationCommandOptionType.String,
      name: 'runtime',
      description: 'The runtime in which the code is written.',
      required: false,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'code',
      description: 'The source code to evaluate.',
      required: false,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'input',
      description: 'The STDIN input to provide to the program.',
      required: false,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'arguments',
      description: 'Additional command line arguments to pass to the program.',
      required: false,
    },
  ];

  components = [EditEvaluationButton];
  modals = [EvaluateModal, EvaluateModalEdit];

  async run(interaction: CommandInteraction) {
    const runtime = interaction.options.getString('runtime');
    const code = interaction.options.getString('code');
    const input = interaction.options.getString('input');
    const args = interaction.options.getString('arguments');

    if (runtime && code) {
      return handleEvaluating(interaction, { runtime, code, args, input });
    } else {
      const modal = new EvaluateModal({ runtime, code, args, input });
      return interaction.showModal(modal);
    }
  }
}
