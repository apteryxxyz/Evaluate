import posthog from 'posthog-js';
import { env } from '~env';

if (env.PLASMO_PUBLIC_POSTHOG_KEY) {
  function registerId(id: string) {
    posthog.register({
      distinct_id: id,
      $set: { platform: 'browser extension' },
      platform: 'browser extension',
    });
  }

  chrome.storage.local.get(['distinctId']).then(({ distinctId }) => {
    console.log('distinctId =', distinctId);

    posthog.init(env.PLASMO_PUBLIC_POSTHOG_KEY!, {
      api_host: `${env.PLASMO_PUBLIC_WEBSITE_URL}/api/v1/ingest`,
      ui_host: 'https://us.posthog.com/',
      persistence: 'memory',
      respect_dnt: false,
      capture_pageview: false,
      capture_pageleave: false,
      autocapture: false,
      disable_compression: true,
      advanced_disable_decide: true,
      disable_session_recording: true,
      async loaded() {
        if (!distinctId) {
          distinctId = posthog.get_distinct_id();
          await chrome.storage.local.set({ distinctId });
        }
        registerId(distinctId);
      },
    });
  });
}

export default env.PLASMO_PUBLIC_POSTHOG_KEY ? posthog : null;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function wrapCapture<T extends (...args: any[]) => any>(cb: T) {
  return ((event: MouseEvent) => {
    if (env.PLASMO_PUBLIC_POSTHOG_KEY) {
      posthog.config.autocapture = true;
      // @ts-expect-error - _captureEvent is private
      posthog.autocapture?._captureEvent(event);
      posthog.config.autocapture = false;
    }

    return cb(event);
  }) as unknown as T;
}
