import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),

  WEBSITE_URL: z.string().url(),
  NEXT_PUBLIC_WEBSITE_URL: z.string().url(),

  UMAMI_ID: z.string().optional(),
  NEXT_PUBLIC_UMAMI_ID: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    interface ProcessEnv extends Env {
      [key: Uppercase<string>]: string | undefined;
    }
  }
}
