// import { webcrypto } from 'crypto';
import { useStorage } from '@plasmohq/storage/hook';
import posthog from 'posthog-js';
import { PostHogProvider, usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

export function AnalyticsProvider(p: React.PropsWithChildren) {
  const [distinctId, setDistinctId] = useStorage('distinct_id', '...');

  useEffect(() => {
    if (!process.env.PLASMO_PUBLIC_POSTHOG_KEY) return;
    // still waiting for storage to be ready
    if (distinctId === '...') return;

    if (distinctId) posthog.register({ distinct_id: distinctId });
    posthog.register({
      platform: 'browser extension',
      locale: window.navigator.language,
    });

    posthog.init(process.env.PLASMO_PUBLIC_POSTHOG_KEY, {
      // api_host: absoluteUrl('/ingest'),
      // ui_host: 'https://app.posthog.com/',
      capture_pageview: false,
      capture_pageleave: false,
      autocapture: false,
      loaded: () => setDistinctId(posthog.get_distinct_id()),
    });
  }, [distinctId, setDistinctId]);

  return <PostHogProvider client={posthog}>{p.children}</PostHogProvider>;
}

export const useAnalytics = usePostHog;
export const analytics = posthog;
