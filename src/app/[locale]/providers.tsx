'use client';

import { ServerThemeProvider } from 'next-themes';
import { useMemo, useState } from 'react';
import type { Locale } from 'translations';
import { LanguagesProvider } from '@/contexts/languages';
import { LocaleProvider } from '@/contexts/locale';
import { TranslateProvider } from '@/contexts/translate';
import type { Language } from '@/services/piston';

export function HTMLProviders(p: React.PropsWithChildren) {
  return (
    <ServerThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {p.children}
    </ServerThemeProvider>
  );
}

export function MainProviders(p: React.PropsWithChildren<{ locale: Locale }>) {
  const [initialLanguages, setInitialLanguages] = useState<Language[]>([]);
  const [filteredLanguages, setFilteredLanguages] = useState<Language[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const locale = useMemo(() => p.locale, [p.locale]);

  return (
    <LocaleProvider value={locale}>
      <TranslateProvider>
        <LanguagesProvider
          value={{
            initial: initialLanguages,
            filtered: filteredLanguages,
            setInitial: setInitialLanguages,
            setFiltered: setFilteredLanguages,
            isSearching,
            setIsSearching,
          }}
        >
          {p.children}
        </LanguagesProvider>
      </TranslateProvider>
    </LocaleProvider>
  );
}
