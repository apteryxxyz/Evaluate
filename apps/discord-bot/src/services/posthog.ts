import createLogger from '@evaluate/logger';
import { merge } from 'es-toolkit/object';
import { PostHog } from 'posthog-node';
import env from '~/env';

export const captureLog = createLogger({
  badge: 'posthog capture',
  hex: '#eb9d2a',
});

export function isAvailable() {
  return Boolean(
    env.POSTHOG_KEY, // has a posthog key
  );
}

export function initPostHog() {
  if (!isAvailable()) return;

  const posthog = new PostHog(env.POSTHOG_KEY!, {
    host: 'https://us.i.posthog.com/',
    flushAt: 1,
    flushInterval: 0,
    persistence: 'memory',
  });

  return posthog;
}

const posthog = initPostHog();
export default posthog;

// ===== //

export function captureEvent(
  context: {
    interaction?: { locale: string };
    user: { id: string; username: string; global_name: string | null };
    channel?: { id: string };
    guild?: { id: string };
    session?: { id: string };
  },
  event: string,
  properties: object,
) {
  properties = merge(properties, {
    $session_id: context.session?.id,
    $set_once: { platform: 'discord' },
    source: 'discord bot',
  });

  if (context.interaction?.locale) {
    properties = merge(properties, {
      $browser_language: context.interaction?.locale,
    });
  }

  if (context.user) {
    properties = merge(properties, {
      $set: {
        username: context.user.username,
        name: context.user.global_name,
      },
    });
  }

  if (context.guild) {
    properties = merge(properties, {
      guild_id: context.guild.id,
    });
  }

  if (context.channel) {
    const url = new URL(
      `/channels/${context.guild?.id ?? '@me'}/${context.channel.id}`,
      'https://discord.com/',
    );
    properties = merge(properties, {
      $current_url: url.toString(),
      $host: url.host,
      $pathname: url.pathname,
      $referrer: '$direct',
      $referring_domain: '$direct',
      $set: {
        $current_url: url.toString(),
        $host: url.host,
        $pathname: url.pathname,
        $referrer: '$direct',
        $referring_domain: '$direct',
      },
      $set_once: {
        $initial_current_url: url.toString(),
        $initial_host: url.host,
        $initial_pathname: url.pathname,
        $initial_referrer: '$direct',
        $initial_referring_domain: '$direct',
      },
      channel_id: context.channel.id,
    });
  }

  captureLog(event, properties);
  posthog?.capture({
    distinctId: context.user.id,
    event,
    properties,
  });
}
