import { createContext, useContext } from 'react';
import type { Locale } from 'translations';

export const LocaleContext = createContext<Locale>('en-GB');
LocaleContext.displayName = 'LocaleContext';
export const LocaleProvider = LocaleContext.Provider;

export function useLocale() {
  return useContext(LocaleContext);
}
