import { createLogger } from '@evaluate/helpers/create-logger';
import posthog from 'posthog-js';
import env from '~/env';

export const captureLog = createLogger({
  badge: 'posthog capture',
  hex: '#eb9d2a',
});
export const sessionLog = createLogger({
  badge: 'posthog session',
  hex: '#eb9d2a',
});

export function isAvailable() {
  return Boolean(
    env.VITE_PUBLIC_POSTHOG_KEY, // has a posthog key
  );
}

export function initPostHog() {
  if (!isAvailable()) return;

  posthog.init(env.VITE_PUBLIC_POSTHOG_KEY!, {
    api_host: `${env.VITE_PUBLIC_WEBSITE_URL}/api/ingest`,
    ui_host: 'https://us.posthog.com/',

    // Minimal tracking, only sessions, never people
    persistence: 'memory',
    person_profiles: 'never',

    // Don't track anything unrelated to this extension
    autocapture: { css_selector_allowlist: ['#evaluate-shadow-container'] },
    capture_pageview: false,
    capture_pageleave: false,
    disable_compression: true,
    disable_external_dependency_loading: true,
    disable_session_recording: true,
    disable_surveys: true,
    enable_heatmaps: false,
    advanced_disable_decide: true,

    before_send(capture) {
      if (capture) captureLog(capture.event, capture);
      return capture;
    },
  });

  posthog.register({
    $set_once: { platform: 'browser' },
    source: 'browser extension',
  });

  return posthog;
}

export default initPostHog();
