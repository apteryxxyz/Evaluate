import { validateEnv } from '@evaluate/env';
import { z } from 'zod';

export const env = validateEnv({
  prefix: 'PLASMO_PUBLIC_',
  client: {
    PLASMO_PUBLIC_WEBSITE_URL: z
      .string()
      .url()
      .refine((v) => !v.endsWith('/'), 'should not end with a slash'),
    PLASMO_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  },

  variablesStrict: {
    PLASMO_PUBLIC_WEBSITE_URL: process.env.PLASMO_PUBLIC_WEBSITE_URL,
    PLASMO_PUBLIC_POSTHOG_KEY: process.env.PLASMO_PUBLIC_POSTHOG_KEY,
  },

  onValid(env) {
    if (!env.PLASMO_PUBLIC_POSTHOG_KEY)
      console.warn(
        'Missing Posthog environment variable, analytics will be disabled.',
      );
  },
});
