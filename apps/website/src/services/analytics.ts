import posthog from 'posthog-js';
import env from '~/env';

const enabled = Boolean(
  typeof window !== 'undefined' &&
    !window.location.origin.endsWith('.vercel.app') &&
    env.NEXT_PUBLIC_POSTHOG_KEY,
);
export default enabled ? posthog : null;

if (enabled) {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: `${window.location.origin}/api/ingest`,
    ui_host: 'https://us.posthog.com/',
    persistence: 'localStorage',
    disable_compression: process.env.NODE_ENV === 'development',
    enable_heatmaps: process.env.NODE_ENV === 'production',
  });

  posthog.register({
    platform: 'website',
    $set_once: { platform: 'website' },
  });
}

export function injectPageTracking() {
  if (!enabled) return false;
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
