import {
  ApplicationCommandOptionType,
  Command,
  type CommandInteraction,
  type CommandOptions,
} from '@buape/carbon';
import { EditEvaluationButton } from '~/components/edit-evaluation-button';
import { EvaluateModal, EvaluateModalEdit } from '~/components/evaluate-modal';
import { handleEvaluating } from '~/handlers/evaluate';
import { captureEvent } from '~/services/posthog';
import { getInteractionContext } from '~/utilities/session-context';

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

  async run(use: CommandInteraction) {
    captureEvent(getInteractionContext(use.rawData), 'used_command', {
      command_name: this.name,
    });

    const runtime = use.options.getString('runtime');
    const code = use.options.getString('code');
    const input = use.options.getString('input');
    const args = use.options.getString('arguments');

    if (runtime && code) {
      return handleEvaluating(use, { runtime, code, args, input });
    } else {
      const modal = new EvaluateModal({ runtime, code, args, input });
      return use.showModal(modal);
    }
  }
}
