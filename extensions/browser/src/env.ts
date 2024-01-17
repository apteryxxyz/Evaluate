import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),

  WEBSITE_URL: z.string().url(),
  PLASMO_PUBLIC_WEBSITE_URL: z.string().url(),

  POSTHOG_KEY: z.string().optional(),
  PLASMO_PUBLIC_POSTHOG_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {
      [key: Uppercase<string>]: string | undefined;
    }
  }
}
