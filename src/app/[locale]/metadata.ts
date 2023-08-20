import _ from 'lodash';
import type { Metadata } from 'next/types';
import type { TranslationFunctions } from 'translations';
import { locales } from 'translations';
import { determineLocale } from '@/translations/determine-locale';
import { absoluteUrl, getPathname } from '@/utilities/url-helpers';

export function generateBaseMetadata(
  t: TranslationFunctions,
  path: string,
  base: Metadata,
) {
  const locale = determineLocale(path);
  const pathname = getPathname(path);

  const metadata = _.merge(
    {
      metadataBase: new URL(absoluteUrl()),
      title: 'Evaluate',
      description: t.seo.description(),
      keywords: [
        t.languages(),
        t.identify(),
        t.evaluate(),
        t.evaluate.code(),
        t.evaluate.input(),
        t.evaluate.args(),
        t.evaluate.language(),
        t.evaluate.run(),
        t.evaluate.output(),
      ].map((s) => s.toLowerCase()),
      themeColor: '#2fc086',
      colorScheme: 'light dark',
      alternates: {
        canonical: '/',
        languages: locales.reduce(
          (acc, locale) => ({
            ...acc,
            [locale]: absoluteUrl(`/${locale}${pathname}`),
          }),
          {},
        ),
      },
    } satisfies Metadata,
    base,
  );

  return {
    ...metadata,
    openGraph: {
      type: 'website',
      title: metadata.title,
      description: metadata.description,
      locale: locale ?? 'en',
      siteName: 'Evaluate',
      alternateLocale: locales.filter((l) => l !== locale),
      url: absoluteUrl(path),
    },
    twitter: {
      card: 'summary',
      title: metadata.title,
      description: metadata.description,
      creator: '@apteryxxyz',
    },
  };
}
