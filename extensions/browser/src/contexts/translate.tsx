'use client';

import type { Locale, TranslateFunctions } from '@evaluate/translate';
import { getTranslate, locales } from '@evaluate/translate';
import { Storage } from '@plasmohq/storage';
import { Loader2Icon } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type TranslateContextProps = TranslateFunctions & {
  locale: Locale;
  setLocale(locale: Locale): void;
};
export const TranslateContext = //
  createContext<TranslateContextProps>(null!);
TranslateContext.displayName = 'TranslateContext';
export const TranslateConsumer = TranslateContext.Consumer;

const storage = new Storage();

export function TranslateProvider(p: React.PropsWithChildren) {
  const [locale, setMemoryLocale] = useState<Locale>();
  const translate = useMemo(() => locale && getTranslate(locale), [locale]);

  useEffect(() => {
    void storage.get<string | undefined>('locale').then((locale) => {
      if (locale) {
        setMemoryLocale(locale as Locale);
      } else {
        const { languages } = window.navigator;
        const locale = languages.find((l) => locales.includes(l as Locale));
        storage.set('locale', (locale as Locale) ?? 'en');
        setMemoryLocale((locale as Locale) ?? 'en');
      }
    });
  }, []);

  const setLocale = useCallback((locale: Locale) => {
    storage.set('locale', locale);
    setMemoryLocale(locale);
  }, []);

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
