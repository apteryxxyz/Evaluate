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

export function TranslateProvider(p: React.PropsWithChildren) {
  const [memory, setMemory] = useState<Locale>();
  const translate = useMemo(() => memory && getTranslate(memory), [memory]);

  useEffect(() => {
    const storage = localStorage.getItem('evaluate.locale');
    setMemory(storage && storage in locales ? (storage as Locale) : 'en');
  }, []);

  useEffect(() => {
    if (memory) {
      localStorage.setItem('evaluate.locale', memory);
      document.documentElement.lang = memory;
    }
  }, [memory]);

  const value = useMemo(
    () =>
      memory
        ? Object.assign({}, translate, {
            locale: memory,
            setLocale: setMemory,
          })
        : undefined,
    [translate, memory],
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
