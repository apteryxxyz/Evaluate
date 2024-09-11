import { LinkButton } from '@buape/carbon';
import { env } from '~/env';
import { resolveEmoji } from '~/utilities/resolve-emoji';

export class OpenEvaluationButton extends LinkButton {
  label = 'Open Evaluation';
  url = env.WEBSITE_URL;
  override emoji = resolveEmoji('globe', true);

  public constructor(url: string) {
    super();
    this.url = url;
  }
}
