import posthog from 'posthog-js';
import { env } from '~env';
import { getDistinctId, setDistinctId } from '~utilities/analytics-helpers';

if (env.PLASMO_PUBLIC_POSTHOG_KEY) {
  function registerId(id: string) {
    posthog.identify(id, { platform: 'browser extension' });
    posthog.register({ platform: 'browser extension' });
  }

  getDistinctId().then((id) => {
    posthog.init(env.PLASMO_PUBLIC_POSTHOG_KEY!, {
      api_host: `${env.PLASMO_PUBLIC_WEBSITE_URL}/api/v1/ingest`,
      ui_host: 'https://us.posthog.com/',
      person_profiles: 'identified_only',
      persistence: 'localStorage',
      respect_dnt: false,
      capture_pageview: false,
      capture_pageleave: false,
      autocapture: false,
      disable_compression: true,
      advanced_disable_decide: true,
      disable_session_recording: true,
      loaded() {
        if (!id) {
          id = posthog.get_distinct_id();
          setDistinctId(id);
        }
        registerId(id);
      },
    });
  });
}

export default env.PLASMO_PUBLIC_POSTHOG_KEY ? posthog : null;
