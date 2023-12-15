'use client';

import {
  Locale,
  TranslateFunctions,
  getTranslate,
  locales,
} from '@evaluate/translate';
import { useStorage } from '@plasmohq/storage/hook';
import { createContext, useContext, useEffect, useMemo } from 'react';

type TranslateContextProps = TranslateFunctions & {
  locale: Locale;
  setLocale: (value: Locale) => void;
};
export const TranslateContext = //
  createContext<TranslateContextProps | null>(null);
TranslateContext.displayName = 'TranslateContext';

export function TranslateProvider(p: React.PropsWithChildren) {
  const [locale, setLocale] = useStorage<Locale | undefined>('evaluate.locale');
  const translate = useMemo(() => getTranslate(locale ?? locales[0]), [locale]);

  useEffect(() => {
    if (!locale) {
      const languages = window.navigator.languages;
      const locale = languages.find((l) => locales.includes(l as Locale));
      if (locale) setLocale(locale as Locale);
    }
  }, [locale, setLocale]);

  return (
    <TranslateContext.Provider
      value={Object.assign({}, translate, {
        locale: locale ?? locales[0],
        setLocale,
      })}
    >
      {p.children}
    </TranslateContext.Provider>
  );
}

/**
 * Grab the current translate functions from context.
 * @returns a translate functions object
 */
export function useTranslate() {
  const translate = useContext(TranslateContext);
  if (translate) return translate;
  throw new Error('Translate not found');
}
