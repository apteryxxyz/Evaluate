import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod/v4';

export default createEnv({
  clientPrefix: 'VITE_PUBLIC_',
  client: {
    VITE_PUBLIC_WEBSITE_URL: z.url().transform((v) => new URL(v)),
    VITE_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  },

  runtimeEnv: {
    ...import.meta.env,
    VITE_PUBLIC_WEBSITE_URL: import.meta.env.VITE_PUBLIC_WEBSITE_URL,
    VITE_PUBLIC_POSTHOG_KEY: import.meta.env.VITE_PUBLIC_POSTHOG_KEY,
  },
});
