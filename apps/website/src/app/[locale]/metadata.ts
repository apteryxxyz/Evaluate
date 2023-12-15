import { Locale, getTranslate, locales } from '@evaluate/translate';
import _merge from 'lodash/merge';
import { Metadata } from 'next';
import { absoluteUrl } from '~/utilities/url-helpers';

export function generateBaseMetadata(
  [locale, pathname]: [Locale, string],
  overrides: Metadata = {},
) {
  const t = getTranslate(locale);

  const metadata = _merge(
    {
      metadataBase: new URL(absoluteUrl()),
      title: 'Evaluate',
      description: t.seo.description(),
      keywords: [
        t.languages(),
        t.evaluate(),
        t.evaluate.code(),
        t.evaluate.input(),
        t.evaluate.args(),
        t.evaluate.language(),
        t.evaluate.run(),
        t.evaluate.output(),
      ].map((x) => x.toLowerCase()),

      alternates: {
        languages: locales.reduce(
          (languages, locale) => ({
            // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
            ...languages,
            [locale]: absoluteUrl(`/${locale}/${pathname}`),
          }),
          {},
        ),
      },
    } satisfies Metadata,
    overrides,
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
      url: absoluteUrl(`/${locale}/${pathname}`),
    },
    twitter: {
      card: 'summary',
      title: metadata.title,
      description: metadata.description,
      creator: '@apteryxxyz',
    },
  };
}
