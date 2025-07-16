import {
  ApplicationAuthorizedListener,
  type ApplicationWebhookEventType,
  type ListenerEventData,
} from '@buape/carbon';
import { captureEvent } from '~/services/posthog';
import { getUserContext } from '~/utilities/session-context';

export class ApplicationAuthorisedListener extends ApplicationAuthorizedListener {
  async handle(
    data: ListenerEventData[ApplicationWebhookEventType.ApplicationAuthorized],
  ) {
    if (data.guild)
      captureEvent(getUserContext(data.user), 'installed_app', {
        install_type: 'guild',
        guild_id: data.guild.id,
      });
    else if (data.user)
      captureEvent(getUserContext(data.user), 'installed_app', {
        install_type: 'user',
        user_id: data.user.id,
      });
  }
}
