import {
  ApplicationCommandOptionType,
  type AutocompleteInteraction,
  Command,
  type CommandInteraction,
} from '@buape/carbon';
import { sayable } from '@sayable/carbon';
import type { Sayable } from 'sayable';
import { EvaluateModal } from '~/components/evaluate-modal';
import { handleEvaluating } from '~/handlers/evaluate';
import { getInteractionContext } from '~/helpers/session-context';
import piston from '~/services/piston.js';
import { captureEvent } from '~/services/posthog';

export class EvaluateCommand extends sayable(Command) {
  constructor(say: Sayable) {
    super(say, (say) => ({
      name: say`evaluate`,
      description: say`Evaluate any piece of code in any runtime with optional input and command line arguments.`,
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: say`runtime`,
          description: say`The runtime in which the code is written.`,
          required: false,
          autocomplete: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: say`code`,
          description: say`The source code to evaluate.`,
          required: false,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: say`input`,
          description: say`The STDIN input to provide to the program.`,
          required: false,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: say`arguments`,
          description: say`Additional command line arguments to pass to the program.`,
          required: false,
        },
      ],
    }));
  }

  async autocomplete(interaction: AutocompleteInteraction) {
    const runtime = interaction.options.getString('runtime');

    if (runtime) {
      const runtimes = await piston.runtimes.search(runtime);
      return interaction.respond(
        runtimes.slice(0, 25).map((r) => ({ name: r.name, value: r.id })),
      );
    } else {
      const runtimes = await piston.runtimes();
      return interaction.respond(
        runtimes.slice(0, 25).map((r) => ({ name: r.name, value: r.id })),
      );
    }
  }

  async run(interaction: CommandInteraction) {
    captureEvent(getInteractionContext(interaction.rawData), 'used_command', {
      command_name: this.name,
    });

    const runtime = interaction.options.getString('runtime');
    const code = interaction.options.getString('code');
    const input = interaction.options.getString('input');
    const args = interaction.options.getString('arguments');

    if (runtime && code) {
      return handleEvaluating(interaction, runtime, { code, args, input });
    } else {
      const modal = new EvaluateModal(
        interaction.say, //
        { runtime, code, args, input },
      );
      return interaction.showModal(modal);
    }
  }
}
