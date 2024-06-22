import { Storage } from '@plasmohq/storage';
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
    const storage = new Storage();
    return storage.get<string | undefined>('distinct_id');
  } else {
    return chrome.runtime.sendMessage({
      from: 'analytics',
      to: 'background',
      subject: 'getDistinctId',
    });
  }
}

export async function setDistinctId(id: string) {
  if (typeof window === 'undefined') {
    const storage = new Storage();
    await storage.set('distinct_id', id);
  } else {
    return chrome.runtime.sendMessage({
      from: 'analytics',
      to: 'background',
      subject: 'setDistinctId',
      ...{ distinctId: id },
    });
  }
}
