import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),

  WEBSITE_URL: z.string().url(),
  NEXT_PUBLIC_WEBSITE_URL: z.string().url(),

  POSTHOG_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
});

export type Env = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {
      // @ts-ignore
      [key: Uppercase<string>]: string | undefined;
    }
  }
}
