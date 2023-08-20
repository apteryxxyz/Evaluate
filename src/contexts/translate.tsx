import { createContext, useContext, useMemo } from 'react';
import type { TranslationFunctions } from 'translations';
import { getTranslate } from '@/translations/determine-locale';
import { useLocale } from './locale';

export const TranslateContext = //
  createContext<TranslationFunctions | null>(null);
TranslateContext.displayName = 'TranslateContext';

export function TranslateProvider(p: React.PropsWithChildren) {
  const locale = useLocale();
  const t = useMemo(() => getTranslate(locale), [locale]);

  return (
    <TranslateContext.Provider value={t}>
      {p.children}
    </TranslateContext.Provider>
  );
}

export function useTranslate() {
  const t = useContext(TranslateContext);
  if (t) return t;
  throw new Error('useTranslate must be used within a TranslateProvider');
}
