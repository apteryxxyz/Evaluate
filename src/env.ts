import dotenv from 'dotenv';
import { z } from 'zod';

const nodeEnv = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${nodeEnv}` });

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'preview', 'test'])
    .default('development'),
  DISCORD_TOKEN: z.string().min(1),
  DISCORD_CLIENT_PUBLIC_KEY: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  FUNCTION_START_TIMESTAMP: z.string().min(1).default('0'),
  OPENAI_API_URL: z.string().min(1),
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
