// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
/** Trigger a page view event. */
export function triggerPageView(url: string) {
  window.gtag('config', process.env.GOOGLE_MEASUREMENT_ID, {
    page_path: url,
  });
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
/** Trigger a custom event. */
export function emitEvent(name: string, params: Record<string, unknown>) {
  window.gtag('event', name, params);
}
