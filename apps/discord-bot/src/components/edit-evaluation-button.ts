import { Button, type ButtonInteraction, ButtonStyle } from '@buape/carbon';
import { captureEvent } from '~/services/posthog';
import { getEvaluateOptions } from '~/utilities/evaluate-helpers';
import { resolveEmoji } from '~/utilities/resolve-emoji';
import { getInteractionContext } from '~/utilities/session-context';
import { EvaluateModalEdit } from './evaluate-modal';

export class EditEvaluationButton extends Button {
  customId = 'evaluate:edit';
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
