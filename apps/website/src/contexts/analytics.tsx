'use client';

import posthog from 'posthog-js';
import { PostHogProvider, usePostHog } from 'posthog-js/react';
import { absoluteUrl } from '~/utilities/url-helpers';

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: absoluteUrl('/api/ingest'),
    ui_host: 'https://app.posthog.com/',
    capture_pageview: false,
    capture_pageleave: false,
  });

  posthog.register({
    platform: 'website',
    $set: {
      platform: 'website',
      'preferred locale': window.navigator.language,
    },
  });
}

export function AnalyticsProvider(p: React.PropsWithChildren) {
  return <PostHogProvider client={posthog}>{p.children}</PostHogProvider>;
}

export const useAnalytics = usePostHog;
export const analytics = posthog;
