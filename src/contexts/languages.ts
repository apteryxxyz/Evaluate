import { createContext, useContext } from 'react';
import type { Language } from '@/services/piston';

interface ILanguages {
  initial: Language[];
  setInitial: (initial: Language[]) => void;
  filtered: Language[];
  setFiltered: (initial: Language[]) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

export const LanguagesContext = createContext<ILanguages>({
  initial: [],
  setInitial: () => void 0,
  filtered: [],
  setFiltered: () => void 0,
  isSearching: false,
  setIsSearching: () => void 0,
});
LanguagesContext.displayName = 'LanguagesContext';
export const LanguagesProvider = LanguagesContext.Provider;

export function useLanguages(defaultLanguages?: Language[]) {
  const languages = useContext(LanguagesContext);

  if (defaultLanguages && !languages.initial.length) {
    languages.setInitial(defaultLanguages);
    languages.setFiltered(defaultLanguages);
    return {
      ...languages,
      initial: defaultLanguages,
      filtered: defaultLanguages,
    };
  }

  return languages;
}
