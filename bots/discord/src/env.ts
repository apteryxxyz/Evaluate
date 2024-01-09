import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),

  WEBSITE_URL: z.string().url(),
  UMAMI_ID: z.string().min(1).optional(),

  DISCORD_TOKEN: z.string().min(1),
  DISCORD_PUBLIC_KEY: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),
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
