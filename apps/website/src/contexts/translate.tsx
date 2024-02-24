import { Locale, TranslateFunctions, getTranslate } from '@evaluate/translate';
import { createContext, useContext, useMemo } from 'react';

type TranslateContextProps = TranslateFunctions & { locale: Locale };
export const TranslateContext = //
  createContext<TranslateContextProps | null>(null);
TranslateContext.displayName = 'TranslateContext';

export function TranslateProvider(
  p: React.PropsWithChildren<{ locale: Locale }>,
) {
  const translate = useMemo(() => getTranslate(p.locale), [p.locale]);

  return (
    <TranslateContext.Provider
      value={Object.assign({}, translate, { locale: p.locale })}
    >
      {p.children}
    </TranslateContext.Provider>
  );
}

export function useTranslate() {
  return useContext(TranslateContext)!;
}
