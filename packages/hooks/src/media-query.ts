import { useEffect, useState } from 'react';

export function createMediaQueryHook<T extends Record<string, string>>(
  screens: T,
) {
  return function useMediaQuery(
    query:
      | Extract<keyof T, string>
      | (`(${'min' | 'max'}-width: ${string})` & {}),
  ) {
    const [matches, setMatches] = useState(false);
    const mediaQuery =
      query in screens ? `(min-width: ${screens[query]})` : query;

    useEffect(() => {
      const mediaQueryList = window.matchMedia(mediaQuery);
      setMatches(mediaQueryList.matches);

      const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
      mediaQueryList.addEventListener('change', listener);
      return () => mediaQueryList.removeEventListener('change', listener);
    }, [mediaQuery]);

    return matches;
  };
}

import tailwindConfig from '@evaluate/style/tailwind-preset';
export const useMediaQuery = //
  createMediaQueryHook(tailwindConfig.theme.extend.screens);
