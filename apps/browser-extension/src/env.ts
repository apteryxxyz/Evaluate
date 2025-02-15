import URL2 from '@evaluate/helpers/url';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export default createEnv({
  clientPrefix: 'VITE_PUBLIC_',
  client: {
    VITE_PUBLIC_WEBSITE_URL: z
      .string()
      .url()
      .transform((v) => new URL2(v)),
    VITE_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  },

  runtimeEnv: {
    ...import.meta.env,
    VITE_PUBLIC_WEBSITE_URL: import.meta.env.VITE_PUBLIC_WEBSITE_URL,
    VITE_PUBLIC_POSTHOG_KEY: import.meta.env.VITE_PUBLIC_POSTHOG_KEY,
  },
});
