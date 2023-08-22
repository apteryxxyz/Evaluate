import '@total-typescript/ts-reset';
import { API } from '@discordjs/core/dist/http-only';
import { REST } from '@discordjs/rest';
import '@/env';
import '@/console';

export const rest = new REST({ version: '10' }) //
  .setToken(process.env.DISCORD_TOKEN);
export const api = new API(rest);
