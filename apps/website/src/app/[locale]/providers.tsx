'use client';

import type { Locale } from '@evaluate/translate';
import { Toaster } from '@evaluate/react/components/sonner';
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
      cookieName="evaluate.theme"
      enableSystem
      disableTransitionOnChange
    >
      {p.children}
    </ServerThemeProvider>
  );
}

export function MainProviders(p: React.PropsWithChildren<{ locale: Locale }>) {
  const { theme = 'system' } = useTheme();

  return (
    <AnalyticsProvider>
      <TranslateProvider locale={p.locale}>
        <LanguagesProvider>{p.children}</LanguagesProvider>
        <Toaster theme={theme as never} />
      </TranslateProvider>
    </AnalyticsProvider>
  );
}
