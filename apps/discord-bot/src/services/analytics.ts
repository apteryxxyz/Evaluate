import { PostHog } from 'posthog-node';
import env from '~/env';

const enabled = Boolean(env.POSTHOG_KEY);
if (!enabled)
  console.warn(
    'Missing Posthog environment variable, analytics will be disabled.',
  );

export default enabled
  ? new PostHog(env.POSTHOG_KEY!, {
      host: 'https://app.posthog.com/',
      flushAt: 1,
      flushInterval: 0,
    })
  : null;
