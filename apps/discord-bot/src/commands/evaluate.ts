import {
  ApplicationCommandOptionType,
  type AutocompleteInteraction,
  Command,
  type CommandInteraction,
  type CommandOptions,
} from '@buape/carbon';
import { fetchAllRuntimes, searchForRuntimes } from '@evaluate/runtimes';
import { EvaluateModal } from '~/components/evaluate-modal';
import { handleEvaluating } from '~/handlers/evaluate';
import { getInteractionContext } from '~/helpers/session-context';
import { captureEvent } from '~/services/posthog';

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
      autocomplete: true,
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

  async autocomplete(interaction: AutocompleteInteraction) {
    const runtime = interaction.options.getString('runtime');

    if (runtime) {
      const runtimes = await searchForRuntimes(runtime);
      return interaction.respond(
        runtimes.slice(0, 25).map((r) => ({ name: r.name, value: r.id })),
      );
    } else {
      const runtimes = await fetchAllRuntimes();
      return interaction.respond(
        runtimes.slice(0, 25).map((r) => ({ name: r.name, value: r.id })),
      );
    }
  }

  async run(use: CommandInteraction) {
    captureEvent(getInteractionContext(use.rawData), 'used_command', {
      command_name: this.name,
    });

    const runtime = use.options.getString('runtime');
    const code = use.options.getString('code');
    const input = use.options.getString('input');
    const args = use.options.getString('arguments');

    if (runtime && code) {
      return handleEvaluating(use, runtime, { code, args, input });
    } else {
      const modal = new EvaluateModal({ runtime, code, args, input });
      return use.showModal(modal);
    }
  }
}
