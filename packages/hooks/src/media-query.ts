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

export function createContainerQueryHook<T extends Record<string, string>>(
  containers: T,
) {
  return function useContainerQuery(
    element: NonNullable<React.RefObject<HTMLElement | null>>,
    query:
      | Extract<keyof T, string>
      | (`(${'min' | 'max'}-width: ${string})` & {}),
  ) {
    const [matches, setMatches] = useState(false);
    const mediaQuery =
      query in containers ? `(min-width: ${containers[query]})` : query;

    useEffect(() => {
      const mediaQueryList = elementMatchMedia(element.current!, mediaQuery);
      setMatches(mediaQueryList.matches);

      const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
      mediaQueryList.addEventListener('change', listener);
      return () => mediaQueryList.removeEventListener('change', listener);
    }, [element.current, mediaQuery]);

    return matches;
  };
}

function elementMatchMedia(element: HTMLElement, query = 'screen') {
  let iframe = document.querySelector<HTMLIFrameElement>('iframe#match-media');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'match-media';
    iframe.style.display = 'none';
    iframe.style.position = 'fixed';
    iframe.style.transform = 'translate(-100vw, -100vh)';
    document.documentElement.appendChild(iframe);
  }

  const dimensions = element.getBoundingClientRect();
  for (const d of ['width', 'height'] as const)
    iframe.style[d] = `${dimensions[d]}px`;
  iframe.offsetWidth;

  return iframe.contentWindow!.matchMedia(query);
}

import tailwindConfig from '@evaluate/style/tailwind-preset';
export const useMediaQuery = //
  createMediaQueryHook(tailwindConfig.theme.screens);
export const useContainerQuery = //
  createContainerQueryHook(tailwindConfig.theme.containers);
