import { validateEnv } from '@evaluate/env/validator';
import { z } from 'zod';

export const env = validateEnv({
  prefix: 'NEXT_PUBLIC_',
  client: {
    NEXT_PUBLIC_WEBSITE_URL: z
      .string()
      .url()
      .refine((v) => !v.endsWith('/'), 'should not end with a slash'),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  },

  variablesStrict: {
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  },

  onValid(env) {
    if (!env.NEXT_PUBLIC_POSTHOG_KEY)
      console.warn(
        'Missing Posthog environment variable, analytics will be disabled.',
      );
  },
});
