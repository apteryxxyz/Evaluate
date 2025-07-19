import { Button, type ButtonInteraction, ButtonStyle } from '@buape/carbon';
import { getEvaluateOptions } from '~/helpers/evaluate-helpers';
import { resolveEmoji } from '~/helpers/resolve-emoji';
import { getInteractionContext } from '~/helpers/session-context';
import { captureEvent } from '~/services/posthog';
import { EvaluateModalEdit } from './evaluate-modal';

export class EditEvaluationButton extends Button {
  customId = 'evaluate,edit';
  style = ButtonStyle.Success;
  label = 'Edit';
  emoji = resolveEmoji('pencil', true);

  async run(click: ButtonInteraction) {
    captureEvent(getInteractionContext(click.rawData), 'clicked_button', {
      button_id: this.customId,
    });

    const embed = click.embeds?.[0]!;
    const options = getEvaluateOptions(embed);
    return click.showModal(new EvaluateModalEdit(options));
  }
}
