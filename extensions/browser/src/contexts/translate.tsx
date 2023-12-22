'use client';

import type { Locale, TranslateFunctions } from '@evaluate/translate';
import { getTranslate, locales } from '@evaluate/translate';
import { useStorage } from '@plasmohq/storage/hook';
import { Loader2Icon } from 'lucide-react';
import { createContext, useContext, useEffect, useMemo } from 'react';

type TranslateContextProps = TranslateFunctions & {
  locale: Locale;
  setLocale(locale: Locale): void;
};
export const TranslateContext = //
  createContext<TranslateContextProps>(null!);
TranslateContext.displayName = 'TranslateContext';
export const TranslateConsumer = TranslateContext.Consumer;

export function TranslateProvider(p: React.PropsWithChildren) {
  const [locale, setLocale] = useStorage<Locale>('locale');
  const translate = useMemo(() => locale && getTranslate(locale), [locale]);

  useEffect(() => {
    if (!locale) {
      const { languages } = window.navigator;
      const locale = languages.find((l) => locales.includes(l as Locale));
      if (locale) setLocale(locale as Locale);
    }
  }, [locale, setLocale]);

  const value = useMemo(
    () => locale && Object.assign({}, translate, { locale, setLocale }),
    [translate, locale, setLocale],
  );

  return value ? (
    <TranslateContext.Provider value={value} {...p} />
  ) : (
    <div className="flex w-full h-full items-center justify-center">
      <Loader2Icon className="animate-spin" />
    </div>
  );
}

/**
 * Grab the current translate functions from context.
 * @returns a translate functions object
 */
export function useTranslate() {
  return useContext(TranslateContext);
}
