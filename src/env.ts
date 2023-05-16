/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */

import 'dotenv-flow/config';
import { z } from 'zod';

export const envSchema = z.object({
    NODE_ENV: z
        .union([z.literal('production'), z.literal('development')])
        .default('development'),
    PORT: z.string().regex(/\d+/).default('3000'),
    DISCORD_ID: z.string(),
    DISCORD_TOKEN: z.string(),
    DISCORD_GUILD_ID: z.string().optional(),
    DISCORD_SUPPORT_CODE: z.string().optional(),
    OPENAI_BASE_PATH: z.string().optional(),
    OPENAI_KEY: z.string(),
    DISCORD_BOT_LIST_API_KEY: z.string(),
    DISCORD_LIST_API_KEY: z.string(),
    DISCORDS_COM_API_KEY: z.string(),
    TOP_GG_API_KEY: z.string(),
    UNIVERSE_LIST_API_KEY: z.string(),
    DISCORD_BOT_LIST_WEBHOOK_TOKEN: z.string(),
    DISCORDS_COM_WEBHOOK_TOKEN: z.string(),
    TOP_GG_WEBHOOK_TOKEN: z.string(),
});

export type Env = z.infer<typeof envSchema>;
declare global {
    namespace NodeJS {
        interface ProcessEnv extends Env {}
    }
}

export const env = envSchema.parse(process.env);
process.env = Object.assign(process.env, env);
