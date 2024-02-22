import { Locale, getTranslate, locales } from '@evaluate/translate';
import _merge from 'lodash/merge';
import type { Metadata } from 'next/types';
import { absoluteUrl } from '~/utilities/url-helpers';

export function generateBaseMetadata(
  [locale, pathname]: [Locale, `/${string}`],
  overrides: Metadata = {},
) {
  const t = getTranslate(locale);

  const metadata = _merge(
    {
      metadataBase: new URL(absoluteUrl()),
      title: 'Evaluate',
      description: t.seo['/'].description(),
      keywords: [
        t.language.s(),
        t.evaluate(),
        t.evaluate.code(),
        t.evaluate.input(),
        t.evaluate.args(),
        t.evaluate.language(),
        t.evaluate.run(),
        t.evaluate.output(),
      ].map((x) => x.toLowerCase()),
    } satisfies Metadata,
    overrides,
  );

  return {
    ...metadata,
    alternates: {
      languages: locales.reduce(
        (acc, locale) =>
          Object.assign(acc, {
            [locale]: absoluteUrl(`/${locale}${pathname}`),
          }),
        {},
      ),
    },
    openGraph: {
      type: 'website',
      title: metadata.title,
      description: metadata.description,
      locale: locale ?? 'en',
      siteName: 'Evaluate',
      alternateLocale: locales.filter((l) => l !== locale),
      url: absoluteUrl(
        locale === locales[0] ? pathname : `/${locale}${pathname}`,
      ),
    },
    twitter: {
      card: 'summary',
      title: metadata.title,
      description: metadata.description,
      creator: '@apteryxxyz',
    },
  } satisfies Metadata;
}
