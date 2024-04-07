'use client';

import { useEventListener } from '@evaluate/react/hooks/event-listener';
import { useCallback, useState } from 'react';

/**
 * Hook to get and set the hash fragment of the URL.
 * @param defaultValue the default value to use if the hash fragment is empty
 * @returns a tuple containing the current hash fragment and a function to set it
 */
export function useHashFragment(): [
  string | undefined,
  (value?: string) => void,
];
export function useHashFragment(
  defaultValue: string,
): [string, (value?: string) => void];

export function useHashFragment(defaultValue?: string) {
  const getHash = useCallback(() => {
    if (typeof window === 'undefined') return null;
    return window.location.hash.slice(1) || defaultValue;
  }, [defaultValue]);

  const [hash, setInternalHash] = useState(getHash);
  useEventListener('hashchange', () => setInternalHash(getHash()));

  const setHash = useCallback(
    (value?: string) => {
      if (typeof window === 'undefined' || value === defaultValue) return;
      window.location.hash = value ?? '';
    },
    [defaultValue],
  );

  return [hash, setHash] as const;
}
