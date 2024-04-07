import { useCallback, useEffect, useState } from 'react';

export function useForceUpdate(
  subscribe?: (caller: () => void) => void,
  unsubscribe?: (caller: () => void) => void,
) {
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    subscribe?.(forceUpdate);
    return () => unsubscribe?.(forceUpdate);
  }, [forceUpdate, subscribe, unsubscribe]);

  return forceUpdate;
}
