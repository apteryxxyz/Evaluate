import { validateEnv } from '@evaluate/env/validator';
import { z } from 'zod';

export const env = validateEnv({
  server: {
    ENV: z.enum(['development', 'production']),
    WEBSITE_URL: z.string().url(),
    POSTHOG_KEY: z.string().optional(),
    DISCORD_TOKEN: z.string().min(1).optional(),
    DISCORD_PUBLIC_KEY: z.string().min(1).optional(),
    DISCORD_CLIENT_ID: z.string().min(1).optional(),
    DISCORD_CLIENT_SECRET: z.string().min(1).optional(),
  },

  variablesStrict: {
    ENV: process.env.NODE_ENV,
    WEBSITE_URL: process.env.WEBSITE_URL || `https://${process.env.VERCEL_URL}`,
    POSTHOG_KEY: process.env.POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    DISCORD_PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
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
