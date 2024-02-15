'use client';

import { Button } from '@evaluate/react/components/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useCallback } from 'react';
import { useTranslate } from '~/contexts/translate';
import { analytics } from '~contexts/analytics';
import { useTheme } from '~contexts/theme';

export function ThemeSwitcher() {
  const t = useTranslate();
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    analytics.capture('theme changed', {
      'old value': theme,
      'new value': theme === 'light' ? 'dark' : 'light',
      platform: 'browser extension',
    });
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="aspect-square"
    >
      <SunIcon
        size={16}
        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <MoonIcon
        size={16}
        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      {t && <span className="sr-only">{t.sr.toggle_theme()}</span>}
    </Button>
  );
}
