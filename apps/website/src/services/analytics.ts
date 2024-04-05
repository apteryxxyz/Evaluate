import posthog from 'posthog-js';
import { env } from '~/env';

if (typeof window !== 'undefined' && env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: `${env.NEXT_PUBLIC_WEBSITE_URL}/api/v0/ingest`,
    ui_host: 'https://app.posthog.com/',
    capture_pageview: false,
    capture_pageleave: false,
  });

  posthog.register({
    platform: 'website',
    $set: { platform: 'website' },
  });
}

export default env.NEXT_PUBLIC_POSTHOG_KEY ? posthog : null;
