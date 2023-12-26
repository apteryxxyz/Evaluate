'use client';

import { Button } from '@evaluate/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslate } from '~/contexts/translate';

export function ThemeSwitcher() {
  const t = useTranslate();
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="aspect-square"
    >
      <SunIcon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      {t && <span className="sr-only">{t.screen_reader.toggle_theme()}</span>}
    </Button>
  );
}
