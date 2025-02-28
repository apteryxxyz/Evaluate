import { useState } from 'react';
import { useIsomorphicLayoutEffect } from './isomorphic-layout-effect';

export function createMediaQueryHook<T extends Record<string, string>>(
  breakpoints: T,
) {
  return function useMediaQuery(
    query:
      | Extract<keyof T, string>
      | (`(${'min' | 'max'}-width: ${string})` & {}),
  ) {
    const mediaQuery =
      query in breakpoints ? `(min-width: ${breakpoints[query]})` : query;

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

export const useMediaQuery = createMediaQueryHook({
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
});
