import { API } from '@discordjs/core/http-only';
import { REST } from '@discordjs/rest';
import { env } from '~/env';

export const rest = new REST({ version: '10' });
if (env.DISCORD_TOKEN) rest.setToken(env.DISCORD_TOKEN);
export const api = new API(rest);
