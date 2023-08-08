/* eslint-disable @typescript-eslint/no-var-requires */

import IntlMessageFormat from 'intl-messageformat';
import type {
  Locale,
  TranslationFunctions,
  TranslationStructure,
} from '../../.translations';
import { baseLocale } from '../../.translations';

function createInternalTranslate(locale: Locale) {
  return (text: string, args?: Record<string, unknown>) => {
    const message = new IntlMessageFormat(text, locale);
    return message.format(args) as string;
  };
}

type InternalTranslate = ReturnType<typeof createInternalTranslate>;

function wrapTarget(target: TranslationStructure, fn: InternalTranslate) {
  if (typeof target === 'string') return fn.bind(null, target);
  return Object.assign(
    Object.defineProperty(() => '', 'name', { writable: true }),
    target,
  );
}

function createProxy(target: TranslationStructure, fn: InternalTranslate) {
  return new Proxy(wrapTarget(target, fn), {
    get: (target, key): unknown => {
      return createProxy(target[key as keyof typeof target], fn);
    },
  });
}

export function useTranslate(locale: Locale = baseLocale) {
  return createProxy(
    require(`../../.translations/${locale}.json`) as TranslationStructure,
    createInternalTranslate(locale),
  ) as unknown as TranslationFunctions;
}
