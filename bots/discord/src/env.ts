import '@evaluate/env/loader/config';
import { validateEnv } from '@evaluate/env/validator';
import { z } from 'zod';

export const env = validateEnv({
  server: {
    WEBSITE_URL: z
      .string()
      .url()
      .refine((v) => !v.endsWith('/'), 'should not end with a slash'),
    DISCORD_TOKEN: z.string().min(1).optional(),
    DISCORD_PUBLIC_KEY: z.string().min(1).optional(),
    DISCORD_CLIENT_ID: z.string().min(1).optional(),
    DISCORD_CLIENT_SECRET: z.string().min(1).optional(),
    POSTHOG_KEY: z.string().min(1).optional(),
  },

  variablesStrict: {
    WEBSITE_URL: process.env.WEBSITE_URL,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    DISCORD_PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    POSTHOG_KEY: process.env.POSTHOG_KEY,
  },

  onValid(env) {
    if (
      !env.DISCORD_TOKEN ||
      !env.DISCORD_PUBLIC_KEY ||
      !env.DISCORD_CLIENT_ID ||
      !env.DISCORD_CLIENT_SECRET
    )
      console.warn(
        'Missing Discord bot environment variables, it will be disabled.',
      );
    if (!env.POSTHOG_KEY)
      console.warn(
        'Missing Posthog environment variable, analytics will be disabled.',
      );
  },
});
