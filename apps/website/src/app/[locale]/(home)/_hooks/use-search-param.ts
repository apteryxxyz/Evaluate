import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useSearchParam(key: string) {
  const searchParams = useSearchParams();
  const value = searchParams.get(key);

  const setSearchParam = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params[value ? 'set' : 'delete'](key, value);
      const url = `${window.location.pathname}${
        params.size ? `?${params}` : ''
      }`;
      window.history.replaceState({}, '', url);
    },
    [key, searchParams],
  );

  return [value, setSearchParam] as const;
}
