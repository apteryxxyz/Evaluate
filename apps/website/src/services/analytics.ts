import posthog from 'posthog-js';
import { env } from '~/env';

if (typeof window !== 'undefined' && env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: `${window.location.origin}/api/v1/ingest`,
    ui_host: 'https://us.posthog.com/',
    persistence: 'localStorage',
    enable_heatmaps: true,
  });

  posthog.register({
    platform: 'website',
    $set: { platform: 'website' },
  });
}

export default env.NEXT_PUBLIC_POSTHOG_KEY ? posthog : null;

export function injectPageTracking() {
  if (!posthog || typeof window === 'undefined') return false;
  if (Reflect.get(history, '__injectPageTracking__')) return true;

  let isNavigating = false;
  let lastLocation = { ...window.location };

  function withoutHash(url: string | URL) {
    return typeof url === 'string' ? url.split('#')[0] : url.href.split('#')[0];
  }

  window.addEventListener('popstate', () => {
    if (
      !isNavigating &&
      withoutHash(lastLocation.href) !== withoutHash(location.href)
    ) {
      posthog.capture('$pageleave', {
        $current_url: withoutHash(lastLocation.href),
        $host: lastLocation.host,
        $pathname: lastLocation.pathname,
      });
      posthog.capture('$pageview', {
        $current_url: withoutHash(location.href),
        $host: location.host,
        $pathname: location.pathname,
      });
    }

    lastLocation = { ...window.location };
  });

  function wrapStateFunction<
    F extends typeof history.pushState | typeof history.replaceState,
  >(fn: F) {
    type T = ThisParameterType<F>;
    type P = Parameters<F>;

    return function (this: T, state: P[0], _: P[1], url: P[2]) {
      const isTracked =
        !isNavigating && url && withoutHash(url) !== withoutHash(location.href);
      if (isTracked) {
        isNavigating = true;
        posthog.capture('$pageleave', {
          $current_url: withoutHash(location.href),
          $host: location.host,
          $pathname: location.pathname,
        });
      }
      fn.apply(this, [state, _, url]);
      if (isTracked)
        setTimeout(() => {
          posthog.capture('$pageview', {
            $current_url: withoutHash(location.href),
            $host: location.host,
            $pathname: location.pathname,
          });
          lastLocation = { ...window.location };
          isNavigating = false;
        }, 50);
    };
  }

  history.pushState = wrapStateFunction(history.pushState);
  history.replaceState = wrapStateFunction(history.replaceState);
  Reflect.set(history, '__injectPageTracking__', true);

  return true;
}
