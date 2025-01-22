import { Client } from '@buape/carbon';
import { EvaluateCommand } from '~/commands/evaluate';
import env from '~/env';

const enabled = Boolean(
  env.DISCORD_CLIENT_ID && env.DISCORD_PUBLIC_KEY && env.DISCORD_TOKEN,
);
if (!enabled)
  console.warn(
    'Missing Discord bot environment variables, bot will be disabled.',
  );

export default enabled
  ? new Client(
      {
        baseUrl: 'unused',
        clientId: env.DISCORD_CLIENT_ID!,
        publicKey: env.DISCORD_PUBLIC_KEY!,
        token: env.DISCORD_TOKEN!,
        deploySecret: 'unused',
        requestOptions: { queueRequests: false },
      },
      [new EvaluateCommand()],
    )
  : null;
