import analytics from '~services/analytics';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function wrapCapture<T extends (...args: any[]) => any>(cb: T) {
  return ((event: MouseEvent) => {
    if (analytics) {
      analytics.config.autocapture = true;
      // @ts-expect-error - _captureEvent is private
      analytics.autocapture?._captureEvent(event);
      analytics.config.autocapture = false;
    }

    return cb(event);
  }) as unknown as T;
}

export async function getDistinctId() {
  if (typeof window === 'undefined') {
    return chrome.storage.sync
      .get('distinctId') //
      .then((res) => res.distinctId);
  } else {
    return chrome.runtime.sendMessage({
      subject: 'getDistinctId',
    });
  }
}

export async function setDistinctId(id: string) {
  if (typeof window === 'undefined') {
    return chrome.storage.sync.set({ distinctId: id });
  } else {
    return chrome.runtime.sendMessage({
      subject: 'setDistinctId',
      ...{ distinctId: id },
    });
  }
}
