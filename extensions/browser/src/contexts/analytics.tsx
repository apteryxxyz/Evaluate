import { Storage } from '@plasmohq/storage';
import posthog from 'posthog-js';
import { PostHogProvider, usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';
import { absoluteUrl } from '~utilities/url-helpers';

const storage = new Storage();

export function AnalyticsProvider(p: React.PropsWithChildren) {
  useEffect(() => {
    function register(id: string) {
      posthog.register({
        distinct_id: id,
        platform: 'browser extension',
        locale: window.navigator.language,
        $set: { platform: 'browser extension' },
      });
    }

    void storage.get<string | undefined>('distinct_id').then((distinctId) => {
      if (!process.env.PLASMO_PUBLIC_POSTHOG_KEY) return;
      if (distinctId) register(distinctId);

      posthog.init(process.env.PLASMO_PUBLIC_POSTHOG_KEY, {
        api_host: absoluteUrl('/ingest2'),
        ui_host: 'https://app.posthog.com/',
        capture_pageview: false,
        capture_pageleave: false,
        autocapture: false,
        disable_compression: true,
        loaded: () => {
          if (distinctId) return;
          void storage.set('distinct_id', posthog.get_distinct_id());
          register(posthog.get_distinct_id());
        },
      });
    });
  }, []);

  return <PostHogProvider client={posthog}>{p.children}</PostHogProvider>;
}

export const useAnalytics = usePostHog;
export const analytics = posthog;
