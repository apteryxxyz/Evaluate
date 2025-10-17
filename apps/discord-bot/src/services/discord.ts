import { Client } from '@buape/carbon';
import { CommandDataPlugin } from '@buape/carbon/command-data';
import { SayablePlugin } from '@sayable/carbon';
import { EvaluateCommand } from '~/commands/evaluate';
import { EditEvaluationButton } from '~/components/edit-evaluation-button.js';
import {
  EvaluateModal,
  EvaluateModalEdit,
} from '~/components/evaluate-modal.js';
import env from '~/env';
import { ApplicationAuthorisedListener } from '~/events/application-authorised';
import say from '~/i18n.js';

const enabled = Boolean(
  env.DISCORD_CLIENT_ID && env.DISCORD_PUBLIC_KEY && env.DISCORD_TOKEN,
);
if (!enabled)
  console.warn(
    'Missing Discord bot environment variables, bot will be disabled.',
  );

const client = enabled
  ? new Client(
      {
        baseUrl: `${env.WEBSITE_URL}api/discord`,
        clientId: env.DISCORD_CLIENT_ID!,
        publicKey: env.DISCORD_PUBLIC_KEY!,
        token: env.DISCORD_TOKEN!,
        deploySecret: env.DISCORD_CLIENT_SECRET!,
        requestOptions: { queueRequests: false },
      },
      {
        commands: [new EvaluateCommand(say)],
        listeners: [new ApplicationAuthorisedListener()],
        components: [new EditEvaluationButton(say)],
      },
      [new CommandDataPlugin(), new SayablePlugin(say)],
    )
  : null;
for (const modal of [new EvaluateModal(say), new EvaluateModalEdit(say)])
  client?.modalHandler.registerModal(modal);

export default client;
