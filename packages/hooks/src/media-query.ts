import { useState } from 'react';

export function createMediaQueryHook<T extends Record<string, string>>(
  screens: T,
) {
  return function useMediaQuery(
    query:
      | Extract<keyof T, string>
      | (`(${'min' | 'max'}-width: ${string})` & {}),
  ) {
    const mediaQuery =
      query in screens ? `(min-width: ${screens[query]})` : query;

    const [matches, setMatches] = useState<boolean>();

    useIsomorphicLayoutEffect(() => {
      if (typeof window === 'undefined') return;

      const mediaQueryList = window.matchMedia(mediaQuery);
      setMatches(mediaQueryList.matches);

      const syncMatches = () => setMatches(mediaQueryList.matches);
      mediaQueryList.addEventListener('change', syncMatches);
      return () => mediaQueryList.removeEventListener('change', syncMatches);
    }, []);

    return matches;
  };
}

import tailwindConfig from '@evaluate/style/tailwind-preset';
import { useIsomorphicLayoutEffect } from './isomorphic-layout-effect';
export const useMediaQuery = //
  createMediaQueryHook(tailwindConfig.theme.extend.screens);
