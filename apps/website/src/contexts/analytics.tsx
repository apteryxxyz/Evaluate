'use client';

import posthog from 'posthog-js';
import { PostHogProvider, usePostHog } from 'posthog-js/react';
import { absoluteUrl } from '~/utilities/url-helpers';

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: absoluteUrl('/ingest2'),
    ui_host: 'https://app.posthog.com/',
    capture_pageview: false,
  });
}

export function AnalyticsProvider(p: React.PropsWithChildren) {
  return <PostHogProvider client={posthog}>{p.children}</PostHogProvider>;
}

export const useAnalytics = usePostHog;
export const analytics = posthog;
