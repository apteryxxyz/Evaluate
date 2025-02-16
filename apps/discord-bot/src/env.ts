import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export default createEnv({
  server: {
    WEBSITE_URL: z
      .string()
      .url()
      .transform((v) => new URL(v)),
    POSTHOG_KEY: z.string().optional(),
    DISCORD_TOKEN: z.string().min(1).optional(),
    DISCORD_PUBLIC_KEY: z.string().min(1).optional(),
    DISCORD_CLIENT_ID: z.string().min(1).optional(),
    DISCORD_CLIENT_SECRET: z.string().min(1).optional(),
  },

  runtimeEnv: {
    WEBSITE_URL: `https://${process.env.VERCEL_URL}`,
    ...process.env,
  },
});
