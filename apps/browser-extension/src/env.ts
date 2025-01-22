import { URL } from '@evaluate/helpers/dist/url';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export default createEnv({
  clientPrefix: 'PLASMO_PUBLIC_',
  client: {
    PLASMO_PUBLIC_WEBSITE_URL: z
      .string()
      .url()
      .transform((v) => new URL(v).freeze()),
    PLASMO_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  },

  runtimeEnv: {
    ...process.env,
    PLASMO_PUBLIC_WEBSITE_URL: process.env.PLASMO_PUBLIC_WEBSITE_URL,
    PLASMO_PUBLIC_POSTHOG_KEY: process.env.PLASMO_PUBLIC_POSTHOG_KEY,
  },
});
