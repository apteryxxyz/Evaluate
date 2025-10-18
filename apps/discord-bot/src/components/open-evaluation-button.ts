import { LinkButton } from '@buape/carbon';
import { sayable } from '@sayable/carbon';
import type { Sayable } from 'sayable';
import env from '~/env';
import { resolveEmoji } from '~/helpers/resolve-emoji';

export class OpenEvaluationButton extends sayable(LinkButton) {
  public constructor(say: Sayable, url?: string) {
    super({ label: say`Open Evaluation` });
    if (url) this.url = url;
  }
  url = `${env.WEBSITE_URL}`;
  emoji = resolveEmoji('globe', true);
}
