import { validateEnv } from '@evaluate/env';
import { readEnv } from '@evaluate/env/loader';
import { z } from 'zod';

Object.assign(process.env, readEnv());

export const env = validateEnv({
  server: {
    CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
    CLOUDFLARE_API_TOKEN: z.string().min(1),
    UPSTASH_REDIS_REST_URL: z.string().min(1).optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  },

  variablesStrict: {
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  },

  onValid(env) {
    if (
      (!env.UPSTASH_REDIS_REST_TOKEN || !env.UPSTASH_REDIS_REST_URL) &&
      process.env.NODE_ENV !== 'development'
    )
      console.warn(
        'Missing Upstash environment variable, rate limiting will be disabled.',
      );
  },
});
