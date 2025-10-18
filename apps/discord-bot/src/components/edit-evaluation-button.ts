import { Button, type ButtonInteraction, ButtonStyle } from '@buape/carbon';
import { sayable } from '@sayable/carbon';
import type { Sayable } from 'sayable';
import { getEvaluateOptions } from '~/helpers/evaluate-helpers';
import { resolveEmoji } from '~/helpers/resolve-emoji';
import { getInteractionContext } from '~/helpers/session-context';
import { captureEvent } from '~/services/posthog';
import { EvaluateModalEdit } from './evaluate-modal';

export class EditEvaluationButton extends sayable(Button) {
  customId = 'evaluate,edit';
  constructor(say: Sayable) {
    super({
      label: say`Edit`,
    });
  }
  style = ButtonStyle.Success;
  emoji = resolveEmoji('pencil', true);

  async run(interaction: ButtonInteraction) {
    captureEvent(getInteractionContext(interaction.rawData), 'clicked_button', {
      button_id: this.customId,
    });

    const embed = interaction.embeds?.[0];
    const options = embed && getEvaluateOptions(embed);
    return interaction.showModal(
      new EvaluateModalEdit(interaction.say, options),
    );
  }
}
