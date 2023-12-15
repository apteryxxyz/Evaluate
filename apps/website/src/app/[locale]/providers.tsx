import { Locale } from '@evaluate/translate';
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

export function MainProviders(p: React.PropsWithChildren<{ locale: Locale }>) {
  return (
    <TranslateProvider locale={p.locale as 'en'}>
      <LanguagesProvider>{p.children}</LanguagesProvider>
    </TranslateProvider>
  );
}
