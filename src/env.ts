import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'preview', 'test'])
    .default('development'),
  APP_URL: z.string().min(1),

  DISCORD_TOKEN: z.string().min(1),
  DISCORD_PUBLIC_KEY: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),

  GOOGLE_MEASUREMENT_ID: z.string().min(1),

  COCKROACH_DB_URL: z.string().min(1),
  OPENAI_API_URL: z.string().min(1),

  REQUEST_TYPE: z.enum(['interaction', 'unknown']).default('unknown'),
  START_TIMESTAMP: z.string().min(1).default('0'),

  NEXT_PUBLIC_APP_URL: z.string(),
  NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID: z.string(),
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
