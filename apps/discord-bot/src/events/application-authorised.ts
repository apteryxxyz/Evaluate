import {
  ApplicationIntegrationType,
  ApplicationWebhookEventType,
  Listener,
  type ListenerEventData,
} from '@buape/carbon';
import { captureEvent } from '~/services/posthog';
import { getUserContext } from '~/utilities/session-context';

export class ApplicationAuthorisedListener extends Listener {
  type = ApplicationWebhookEventType.ApplicationAuthorized;

  async handle(
    data: ListenerEventData<ApplicationWebhookEventType.ApplicationAuthorized>,
  ) {
    if (data.integration_type === ApplicationIntegrationType.GuildInstall)
      captureEvent(getUserContext(data.user), 'installed_app', {
        install_type: 'guild',
        guild_id: data.guild?.id,
      });
    else if (data.integration_type === ApplicationIntegrationType.UserInstall)
      captureEvent(getUserContext(data.user), 'installed_app', {
        install_type: 'user',
        user_id: data.user.id,
      });
  }
}
