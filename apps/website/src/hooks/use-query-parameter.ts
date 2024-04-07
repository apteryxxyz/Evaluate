'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

/**
 * Hook to get and set a query parameter in the URL.
 * @param key the key of the query parameter
 * @param defaultValue the default value to use if the query parameter is empty
 * @returns a tuple containing the current query parameter and a function to set it
 */
export function useQueryParameter(
  key: string,
): [string | undefined, (value?: string) => void];
export function useQueryParameter<T extends string = string>(
  key: string,
  defaultValue: T | (string & {}),
): [T | (string & {}), (value?: T) => void];

export function useQueryParameter(key: string, defaultValue?: string) {
  const searchParams = useSearchParams();
  const query = useMemo(
    () => searchParams.get(key) ?? defaultValue,
    [searchParams, defaultValue, key],
  );

  const setQuery = useCallback(
    (value?: string) => {
      const params = new URLSearchParams(searchParams);
      if (value && value !== defaultValue) params.set(key, value);
      else params.delete(key);
      const query = params.toString();
      const url = `${window.location.pathname}${query ? `?${query}` : ''}`;
      window.history.replaceState({}, '', url);
    },
    [searchParams, defaultValue, key],
  );

  return [query, setQuery] as const;
}
