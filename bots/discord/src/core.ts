import { API } from '@discordjs/core/http-only';
import { REST } from '@discordjs/rest';
import { PostHog } from 'posthog-node';
import './env';

export const rest = new REST({ version: '10' }) //
  .setToken(process.env.DISCORD_TOKEN);

export const api = new API(rest);

export const analytics = process.env.POSTHOG_KEY
  ? new PostHog(process.env.POSTHOG_KEY, {
      host: 'https://app.posthog.com/',
      flushAt: 1,
      flushInterval: 0,
    })
  : undefined;
