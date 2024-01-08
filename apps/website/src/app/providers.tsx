'use client';

import { Toaster } from '@evaluate/react/components/sonner';
import { useEventListener } from '@evaluate/react/hooks/event-listener';
import { ServerThemeProvider, useTheme } from 'next-themes';
import { AnalyticsProvider } from '~/contexts/analytics';
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
  const { theme = 'system' } = useTheme();

  useEventListener('pointermove', ({ x, y }) => {
    document.documentElement.style.setProperty('--mouse-x', x.toFixed(2));
    document.documentElement.style.setProperty('--mouse-y', y.toFixed(2));
  });

  return (
    <AnalyticsProvider>
      <TranslateProvider>
        <LanguagesProvider>
          {p.children}
          <Toaster theme={theme as never} />
        </LanguagesProvider>
      </TranslateProvider>
    </AnalyticsProvider>
  );
}
