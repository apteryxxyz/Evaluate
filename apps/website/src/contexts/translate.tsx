'use client';

import {
  Locale,
  TranslateFunctions,
  getTranslate,
  locales,
} from '@evaluate/translate';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type TranslateContextProps =
  | (TranslateFunctions & {
      locale: Locale;
      setLocale(locale: Locale): void;
    })
  | undefined;
export const TranslateContext = //
  createContext<TranslateContextProps | null>(null);
TranslateContext.displayName = 'TranslateContext';
export const TranslateConsumer = TranslateContext.Consumer;

export function TranslateProvider(p: React.PropsWithChildren) {
  const [locale, setLocale] = useState<Locale>();
  const translate = useMemo(() => locale && getTranslate(locale), [locale]);

  useEffect(() => {
    if (locale) {
      localStorage.setItem('evaluate.locale', locale);
      document.documentElement.lang = locale;
    } else {
      const item = localStorage.getItem('evaluate.locale');
      if (item && item in locales) {
        setLocale(item as Locale);
      } else {
        const languages = window.navigator.languages;
        const locale = languages.find((l) => locales.includes(l as Locale));
        if (locale) setLocale(locale as Locale);
      }
    }
  }, [locale]);

  const value = useMemo(
    () => locale && Object.assign({}, translate, { locale, setLocale }),
    [translate, locale],
  );

  return (
    <TranslateContext.Provider value={value}>
      {p.children}
    </TranslateContext.Provider>
  );
}

/**
 * Grab the current translate functions from context.
 * @returns a translate functions object
 */
export function useTranslate() {
  return useContext(TranslateContext)!;
}
