'use client';

import { type Language, setCachedLanguages } from '@evaluate/languages';
import { createContext, useContext, useState } from 'react';

export const LanguagesContext = createContext({
  languages: [] as Language[],
  setLanguages: (_: Language[]) => {},
  filteredLanguages: [] as Language[],
  setFilteredLanguages: (_: Language[]) => {},
  isSearching: false,
  setIsSearching: (_: boolean) => {},
});
LanguagesContext.displayName = 'LanguagesContext';

export function LanguagesProvider(p: React.PropsWithChildren) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [filteredLanguages, setFilteredLanguages] = useState<Language[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  return (
    <LanguagesContext.Provider
      value={{
        languages,
        setLanguages,
        filteredLanguages,
        setFilteredLanguages,
        isSearching,
        setIsSearching,
      }}
    >
      {p.children}
    </LanguagesContext.Provider>
  );
}

export function useLanguages(defaultLanguages?: Language[]) {
  const context = useContext(LanguagesContext);

  if (defaultLanguages && !context.languages.length) {
    setCachedLanguages(defaultLanguages);
    context.setLanguages(defaultLanguages);
    context.setFilteredLanguages(defaultLanguages);

    return {
      ...context,
      languages: defaultLanguages,
      filteredLanguages: defaultLanguages,
    };
  }

  return context;
}
