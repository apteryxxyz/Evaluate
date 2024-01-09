import { API } from '@discordjs/core/http-only';
import { REST } from '@discordjs/rest';
import { DiscordBotAnalytics } from '@evaluate/analytics';
import './env';

export const rest = new REST({ version: '10' }) //
  .setToken(process.env.DISCORD_TOKEN);
export const api = new API(rest);
export const analytics = process.env.UMAMI_ID
  ? new DiscordBotAnalytics(
      process.env.UMAMI_ID,
      new URL('/api/send', process.env.WEBSITE_URL).toString(),
    )
  : null;
