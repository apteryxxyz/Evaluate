import { Storage } from '@plasmohq/storage';
import posthog from 'posthog-js';
import { env } from '~env';

if (typeof window !== 'undefined' && env.PLASMO_PUBLIC_POSTHOG_KEY) {
  const storage = new Storage();

  function registerId(id: string) {
    posthog.register({
      distinct_id: id,
      platform: 'browser extensions',
      $set: { platform: 'browser extension' },
    });
  }

  void storage.get<string | undefined>('distinct_id').then((id) => {
    if (id) registerId(id);

    posthog.init(env.PLASMO_PUBLIC_POSTHOG_KEY!, {
      api_host: `${env.PLASMO_PUBLIC_WEBSITE_URL}/api/v1/ingest`,
      ui_host: 'https://app.posthog.com/',
      capture_pageview: false,
      capture_pageleave: false,
      autocapture: false,
      disable_compression: true,
      disable_session_recording: true,
      loaded() {
        if (!id) {
          void storage.set('distinct_id', posthog.get_distinct_id());
          registerId(posthog.get_distinct_id());
        }
      },
    });
  });
}

export default env.PLASMO_PUBLIC_POSTHOG_KEY ? posthog : null;
