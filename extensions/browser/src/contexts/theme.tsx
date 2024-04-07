'use client';

import { useStorage } from '@plasmohq/storage/hook';
import { createContext, useContext, useEffect } from 'react';

type ThemeValue = 'light' | 'dark' | 'system';
interface ThemeState {
  theme: ThemeValue;
  resolvedTheme: Exclude<ThemeValue, 'system'>;
  setTheme(theme: ThemeValue): void;
}

export const ThemeContext = createContext<ThemeState>(null!);

export const ThemeConsumer = ThemeContext.Consumer;

export function ThemeProvider(
  p: React.PropsWithChildren<{ getTargets(): (HTMLElement | null)[] }>,
) {
  const [theme, setTheme] = useStorage<ThemeValue>('theme', 'system');
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

  useEffect(() => {
    const oppositeTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    for (const target of p.getTargets()) {
      if (!target) continue;
      target.classList.remove(oppositeTheme);
      target.classList.add(resolvedTheme);
    }
  }, [resolvedTheme, p.getTargets]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {p.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function getSystemTheme() {
  const { matches } = window.matchMedia('(prefers-color-scheme: dark)');
  return matches ? 'dark' : 'light';
}
