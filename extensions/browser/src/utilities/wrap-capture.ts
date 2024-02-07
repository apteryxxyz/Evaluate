import { internal } from 'posthog-js';
import { analytics } from '~contexts/analytics';

export function wrapCapture(callback: (event: MouseEvent) => void) {
  return ((event: MouseEvent) => {
    internal.autocapture._captureEvent(event, analytics, '$autocapture');
    callback(event);
  }) as unknown as React.MouseEventHandler<HTMLElement>;
}
