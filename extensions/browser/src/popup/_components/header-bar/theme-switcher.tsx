'use client';

import { Button } from '@evaluate/react/components/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useCallback } from 'react';
import { useTheme } from '~contexts/theme';
import { wrapCapture } from '~utilities/wrap-capture';

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [setTheme, resolvedTheme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={wrapCapture(toggleTheme)}
      className="no-ph-capture aspect-square"
    >
      <SunIcon className="dark:-rotate-90 size-4 rotate-0 scale-100 transition-all dark:scale-0" />
      <MoonIcon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
}
