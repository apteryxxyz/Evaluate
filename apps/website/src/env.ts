import { EnhancedURL } from '@evaluate/helpers/url';
import { createEnv } from '@t3-oss/env-nextjs';
import { vercel } from '@t3-oss/env-nextjs/presets';
import discordEnv from 'discord-bot/env';
import { z } from 'zod';

export default createEnv({
  extends: [discordEnv, vercel()],

  server: {
    WEBSITE_URL: z
      .string()
      .url()
      .transform((v) => new EnhancedURL(v)),
  },
  client: {
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  },

  runtimeEnv: {
    WEBSITE_URL: `https://${process.env.VERCEL_URL}`,
    ...process.env,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  },
});
