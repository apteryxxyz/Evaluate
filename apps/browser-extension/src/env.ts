import { EnhancedURL } from '@evaluate/helpers/url';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export default createEnv({
  clientPrefix: 'VITE_PUBLIC_',
  client: {
    VITE_PUBLIC_WEBSITE_URL: z
      .string()
      .url()
      .transform((v) => new EnhancedURL(v)),
  },

  runtimeEnv: {
    ...import.meta.env,
    VITE_PUBLIC_WEBSITE_URL: import.meta.env.VITE_PUBLIC_WEBSITE_URL,
  },
});
