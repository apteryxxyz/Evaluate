import { useStorage } from '@plasmohq/storage/hook';
import { createContext, useContext, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ThemeContextProps = { theme: Theme; setTheme(theme: Theme): void };
export const ThemeContext = //
  createContext<ThemeContextProps>({ theme: 'system', setTheme: () => {} });
ThemeContext.displayName = 'ThemeContext';
export const ThemeConsumer = ThemeContext.Consumer;

export function ThemeProvider(
  p: React.PropsWithChildren<{ getTargets(): (HTMLElement | null)[] }>,
) {
  const [theme, setTheme] = useStorage<Theme>('theme', 'system');

  useEffect(() => {
    const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
    const oppositeTheme = resolvedTheme === 'light' ? 'dark' : 'light';

    for (const target of p.getTargets()) {
      if (!target) continue;
      target.classList.remove(oppositeTheme);
      target.classList.add(resolvedTheme);
    }
  }, [theme, p.getTargets]);

  return <ThemeContext.Provider value={{ theme, setTheme }} {...p} />;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function getSystemTheme() {
  const { matches } = window.matchMedia('(prefers-color-scheme: dark)');
  return matches ? 'dark' : 'light';
}
