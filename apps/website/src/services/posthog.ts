import { createLogger } from '@evaluate/helpers/create-logger';
import posthog from 'posthog-js';
import env from '~/env';

export const captureLog = createLogger({
  badge: 'posthog capture',
  hex: '#eb9d2a',
});

export function isAvailable() {
  return Boolean(
    typeof window !== 'undefined' && // client only
      !window.location.origin.endsWith('.vercel.app') && // not hosted on vercel
      env.NEXT_PUBLIC_POSTHOG_KEY, // has a posthog key
  );
}

export function initPostHog() {
  if (!isAvailable()) return;

  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: '/api/journal',
    ui_host: 'https://us.posthog.com/',

    // Minimal tracking, only sessions, never people
    persistence: 'memory',
    person_profiles: 'never',

    disable_compression: process.env.NODE_ENV === 'development',
    capture_pageview: true,
    capture_pageleave: true,

    before_send(capture) {
      if (capture) captureLog(capture.event, capture);
      return capture;
    },
  });

  posthog.register({
    $set_once: { platform: 'website' },
    source: 'website',
  });

  return posthog;
}

export default initPostHog();

// ===== //

export function injectPageEventCapturing() {
  function cleanUrl(url: string | { pathname: string }) {
    url = typeof url === 'object' && 'pathname' in url ? url.pathname : url;
    return url.split('#')[0] || '';
  }

  function capturePageEvent(event: `$page${string}`, location: Location) {
    posthog.capture(event, {
      $current_url: cleanUrl(location.href),
      $host: location.host,
      $pathname: location.pathname,
    });
  }

  // ===== //

  if (!isAvailable()) return false;
  if (Reflect.get(history, '__injectPageTracking__')) return true;

  let isNavigating = false;
  let lastLocation = { ...window.location };

  window.addEventListener('popstate', () => {
    const locationMatch = cleanUrl(location) === cleanUrl(lastLocation);
    const shouldTrack = !isNavigating && !locationMatch;
    if (shouldTrack) {
      capturePageEvent('$pageleave', lastLocation);
      capturePageEvent('$pageview', location);
    }
    lastLocation = { ...window.location };
  });

  function wrapHistoryFunction<
    TTarget extends typeof history.pushState | typeof history.replaceState,
  >(target: TTarget) {
    type T = ThisParameterType<TTarget>;
    type P = Parameters<TTarget>;

    return function (this: T, state: P[0], _: P[1], url: P[2]) {
      const locationMatch = cleanUrl(url ?? '') === cleanUrl(location);
      const shouldTrack = !isNavigating && !locationMatch;
      if (shouldTrack) {
        isNavigating = true;
        capturePageEvent('$pageleave', location);
      }

      target.apply(this, [state, _, url]);
      if (shouldTrack) {
        setTimeout(() => {
          capturePageEvent('$pageview', location);
          lastLocation = { ...window.location };
          isNavigating = false;
        }, 50);
      }
    };
  }

  history.pushState = wrapHistoryFunction(history.pushState);
  history.replaceState = wrapHistoryFunction(history.replaceState);
  Reflect.set(history, '__injectPageTracking__', true);

  return true;
}
