import { useEffect, useState } from 'react';

export function useMediaQuery(
  query: keyof typeof screens | (`(${'min' | 'max'}-width: ${number}px)` & {}),
) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    if (query in screens)
      query = `(min-width: ${screens[query as keyof typeof screens]})`;
    const result = matchMedia(query);
    result.addEventListener('change', onChange);
    setValue(result.matches);

    return () => result.removeEventListener('change', onChange);
  }, [query]);

  return value;
}

const screens = {
  '2xs': '364px',
  xs: '492px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
