import { Client } from '@buape/carbon';
import { EvaluateCommand } from '~/commands/evaluate';
import { EditEvaluationButton } from '~/components/edit-evaluation-button.js';
import {
  EvaluateModal,
  EvaluateModalEdit,
} from '~/components/evaluate-modal.js';
import env from '~/env';
import { ApplicationAuthorisedListener } from '~/events/application-authorised';

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
        baseUrl: 'unused',
        clientId: env.DISCORD_CLIENT_ID!,
        publicKey: env.DISCORD_PUBLIC_KEY!,
        token: env.DISCORD_TOKEN!,
        deploySecret: 'unused',
        requestOptions: { queueRequests: false },
      },
      {
        commands: [new EvaluateCommand()],
        listeners: [new ApplicationAuthorisedListener()],
        components: [new EditEvaluationButton()],
      },
    )
  : null;
for (const modal of [new EvaluateModal(), new EvaluateModalEdit()])
  client?.modalHandler.registerModal(modal);

export default client;
