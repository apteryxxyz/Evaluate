'use client';

import { useEventListener } from '@evaluate/react/hooks/event-listener';
import { ServerThemeProvider } from 'next-themes';
import { LanguagesProvider } from '~/contexts/languages';
import { TranslateProvider } from '~/contexts/translate';

export function HTMLProviders(p: React.PropsWithChildren) {
  return (
    <ServerThemeProvider
      attribute="class"
      defaultTheme="system"
      storageKey="evaluate.theme"
      enableSystem
      disableTransitionOnChange
    >
      {p.children}
    </ServerThemeProvider>
  );
}

export function MainProviders(p: React.PropsWithChildren) {
  useEventListener('pointermove', ({ x, y }) => {
    document.documentElement.style.setProperty('--mouse-x', x.toFixed(2));
    document.documentElement.style.setProperty('--mouse-y', y.toFixed(2));
  });

  return (
    <TranslateProvider>
      <LanguagesProvider>{p.children}</LanguagesProvider>
    </TranslateProvider>
  );
}
