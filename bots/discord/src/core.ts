import { API } from '@discordjs/core/http-only';
import { REST } from '@discordjs/rest';
import { Analytics } from '@evaluate/analytics/bots/discord';
import './env';

export const rest = new REST({ version: '10' }) //
  .setToken(process.env.DISCORD_TOKEN);
export const api = new API(rest);
export const analytics =
  process.env.NODE_ENV === 'production' && process.env.UMAMI_ID
    ? new Analytics(process.env.UMAMI_ID, 'http://localhost:3000/api/send')
    : null;
