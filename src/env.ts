/* eslint-disable n/prefer-global/process */
/* eslint-disable no-restricted-globals */

import 'dotenv-flow/config';
import { z } from 'zod';

export const envSchema = z.object({
    NODE_ENV: z.union([z.literal('production'), z.literal('development')]).default('development'),
    DISCORD_TOKEN: z.string(),
    DISCORD_GUILD_ID: z.string().optional(),
    OPENAI_BASE_PATH: z.string().optional(),
    OPENAI_KEY: z.string()
});

export type Env = z.infer<typeof envSchema>;

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Env {}
    }
}

export const env = envSchema.parse(process.env);
process.env = Object.assign(process.env, env);