import posthog from 'posthog-js';
import { env } from '~/env';

if (typeof window !== 'undefined' && env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: `${window.location.origin}/api/v1/ingest`,
    ui_host: 'https://us.posthog.com/',
    persistence: 'localStorage',
    person_profiles: 'identified_only',
    respect_dnt: false,
    capture_pageview: false,
    capture_pageleave: true,
    enable_heatmaps: true,
  });

  posthog.register({
    platform: 'website',
    $set: { platform: 'website' },
  });
}

export default env.NEXT_PUBLIC_POSTHOG_KEY ? posthog : null;
