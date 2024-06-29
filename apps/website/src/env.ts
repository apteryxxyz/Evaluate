import { validateEnv } from '@evaluate/env/validator';
import { z } from 'zod';

console.info('apps/website/env.ts');
console.info('ProcessEnv', process.env);

export const env = validateEnv({
  server: {
    WEBSITE_URL: z
      .string()
      .url()
      .refine((v) => !v.endsWith('/'), 'should not end with a slash'),
  },
  prefix: 'NEXT_PUBLIC_',
  client: {
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  },

  variablesStrict: {
    WEBSITE_URL: process.env.WEBSITE_URL || `https://${process.env.VERCEL_URL}`,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  },

  onValid(env) {
    if (!env.NEXT_PUBLIC_POSTHOG_KEY)
      console.warn(
        'Missing Posthog environment variable, analytics will be disabled.',
      );
  },
});
