import { internal } from 'posthog-js';
import analytics from '~services/analytics';

export function wrapCapture(callback: (event: MouseEvent) => void) {
  return ((event: MouseEvent) => {
    if (analytics)
      internal.autocapture._captureEvent(event, analytics, '$autocapture');
    callback(event);
  }) as unknown as React.MouseEventHandler<HTMLElement>;
}
