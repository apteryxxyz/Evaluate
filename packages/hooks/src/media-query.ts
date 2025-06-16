import { useState } from 'react';
import { useIsomorphicLayoutEffect } from './isomorphic-layout-effect.js';

// Pre Tailwind v4, this grabbed the breakpoints from the tailwind.config.js, but...
const TAILWIND_BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Evaluate a CSS media query and respond to changes.
 * @param query Tailwind breakpoint or a media query string.
 * @returns Boolean indicating whether the query matches.
 */
export function useMediaQuery(
  query:
    | Extract<keyof typeof TAILWIND_BREAKPOINTS, string>
    | (`(${'min' | 'max'}-width: ${string})` & {}),
) {
  const mediaQuery =
    query in TAILWIND_BREAKPOINTS
      ? (`(min-width: ${TAILWIND_BREAKPOINTS[query as 'sm']})` as const)
      : query;
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
}
