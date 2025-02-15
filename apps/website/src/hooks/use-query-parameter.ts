'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to get and set a query parameter in the URL.
 * @param key the key of the query parameter
 * @param defaultValue the default value to use if the query parameter is empty
 * @returns a tuple containing the current query parameter and a function to set it
 */
export function useQueryParameter(
  key: string,
): [
  query: string | undefined,
  setQuery: React.Dispatch<React.SetStateAction<string | undefined>>,
];
export function useQueryParameter<T extends string = string>(
  key: string,
  defaultValue: T | (string & {}),
): [
  query: T | (string & {}),
  setQuery: React.Dispatch<React.SetStateAction<string | undefined>>,
];

export function useQueryParameter(key: string, defaultValue?: string) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    const url = new URL(window.location.href);
    return url.searchParams.get(key) ?? defaultValue;
  });

  useEffect(() => {
    const updateUrl = () => {
      const url = new URL(window.location.href);
      if (value && value !== defaultValue) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
      window.history.replaceState({}, '', url);
    };

    const timeout = setTimeout(updateUrl, 500);
    return () => clearTimeout(timeout);
  }, [value, key, defaultValue]);

  return [value, setValue] as const;
}
