import { useCallback, useRef, useState } from 'react';
import { useEventListener } from './event-listener';

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
    const mediaQueryList = useRef(
      typeof window === 'undefined' ? null : window.matchMedia(mediaQuery),
    );

    const [matches, setMatches] = useState(mediaQueryList.current?.matches);
    const syncMatches = //
      useCallback(() => setMatches(mediaQueryList.current?.matches), []);
    useEventListener('change', syncMatches, mediaQueryList);
    return matches || false;
  };
}

import tailwindConfig from '@evaluate/style/tailwind-preset';
export const useMediaQuery = //
  createMediaQueryHook(tailwindConfig.theme.extend.screens);
