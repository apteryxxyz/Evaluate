// https://usehooks-ts.com/react-hook/use-event-callback

import { useCallback, useRef } from 'react';
import { useIsomorphicLayoutEffect } from './isomorphic-layout-effect.js';

export function useEventCallback<Args extends unknown[], R>(
  fn: (...args: Args) => R,
): (...args: Args) => R;
export function useEventCallback<Args extends unknown[], R>(
  fn: ((...args: Args) => R) | undefined,
): ((...args: Args) => R) | undefined;
export function useEventCallback<Args extends unknown[], R>(
  fn: ((...args: Args) => R) | undefined,
): ((...args: Args) => R) | undefined {
  const ref = useRef<typeof fn>(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useIsomorphicLayoutEffect(() => {
    ref.current = fn;
  }, [fn]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  return useCallback((...args: Args) => ref.current?.(...args), [ref]) as (
    ...args: Args
  ) => R;
}
