import { createEnv } from '@t3-oss/env-core';
import z from 'zod/v4';

export default createEnv({
  server: {
    WEBSITE_URL: z.url().transform((v) => new URL(v)),
    POSTHOG_KEY: z.string().optional(),
    DISCORD_TOKEN: z.string().min(1).optional(),
    DISCORD_PUBLIC_KEY: z.string().min(1).optional(),
    DISCORD_CLIENT_ID: z.string().min(1).optional(),
    DISCORD_CLIENT_SECRET: z.string().min(1).optional(),
  },

  runtimeEnv: {
    // For some reason, on Vercel our custom env variable parsing doesn't work
    WEBSITE_URL:
      process.env.PUBLIC_WEBSITE_URL ||
      process.env.NEXT_PUBLIC_WEBSITE_URL ||
      `https://${process.env.VERCEL_URL}`,
    POSTHOG_KEY:
      process.env.PUBLIC_POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY,
    ...process.env,
  },
});
