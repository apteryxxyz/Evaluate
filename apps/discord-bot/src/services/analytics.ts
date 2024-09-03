import { PostHog } from 'posthog-node';
import { env } from '~/env';

export default env.POSTHOG_KEY
  ? new PostHog(env.POSTHOG_KEY, {
      host: 'https://app.posthog.com/',
      flushAt: 1,
      flushInterval: 0,
    })
  : null;
