import { createEnv } from '@t3-oss/env-nextjs';
import { vercel } from '@t3-oss/env-nextjs/presets-zod';
import discordEnv from 'discord-bot/env';
import { z } from 'zod/v4';

export default createEnv({
  extends: [discordEnv, vercel()],

  server: {
    WEBSITE_URL: z.url().transform((v) => new URL(v)),
    PISTON_API_KEY: z.string().min(1),
    ALLOWED_ORIGIN: z
      .string()
      .default('*')
      .transform((v) => v.split(',').map((o) => o.trim())),
  },
  client: {
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  },

  runtimeEnv: {
    WEBSITE_URL: `https://${process.env.VERCEL_URL}`,
    PISTON_API_KEY: process.env.PISTON_API_KEY,
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
    ...process.env,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  },
});
