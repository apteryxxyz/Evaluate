import posthog from 'posthog-js';
import { env } from '~env';

const enabled = env.PLASMO_PUBLIC_POSTHOG_KEY && env.PLASMO_PUBLIC_WEBSITE_URL;
export default enabled ? posthog : null;

if (enabled) {
  function registerId(id: string) {
    posthog.register({
      distinct_id: id,
      $set_once: { platform: 'browser extension' },
      platform: 'browser extension',
    });
  }

  chrome.storage.local.get(['distinctId']).then(({ distinctId }) => {
    posthog.init(env.PLASMO_PUBLIC_POSTHOG_KEY!, {
      api_host: `${env.PLASMO_PUBLIC_WEBSITE_URL}/api/ingest`,
      ui_host: 'https://us.posthog.com/',
      persistence: 'memory',
      enable_heatmaps: false,
      disable_compression: true,
      capture_pageview: false,
      capture_pageleave: false,
      autocapture: false,
      advanced_disable_decide: true,
      disable_session_recording: true,
      disable_surveys: true,
      disable_external_dependency_loading: true,
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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function wrapCapture<T extends (...args: any[]) => any>(cb: T) {
  return ((event: MouseEvent) => {
    if (enabled) {
      posthog.config.autocapture = true;
      // @ts-expect-error - _captureEvent is private
      posthog.autocapture?._captureEvent(event);
      posthog.config.autocapture = false;
    }
    return cb(event);
  }) as unknown as T;
}
