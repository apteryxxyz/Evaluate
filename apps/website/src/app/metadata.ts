import _ from 'lodash';
import type { Metadata } from 'next/types';
import { env } from '~/env';

export function generateBaseMetadata(
  pathname: string,
  overrides: Metadata = {},
) {
  const metadata = _.merge(
    {
      metadataBase: new URL(env.WEBSITE_URL),
      title: 'Evaluate',
      description:
        'Test code in any programming language with Evaluate! Quickly run snippets with optional input and command-line arguments using our easy online platform. Try it now!',
      keywords: [
        'Evaluate',
        'Code',
        'Programming',
        'Languages',
        'Tools',
        'Playgrounds',
        'Online',
        'Platform',
        'Code Evaluation',
        'Code Snippets',
        'Programming Languages',
        'Input',
        'Command-Line',
      ].map((k) => k.toLowerCase()),
    } satisfies Metadata,
    overrides,
  );

  return {
    ...metadata,
    openGraph: {
      type: 'website',
      title: metadata.title,
      description: metadata.description,
      locale: 'en',
      siteName: metadata.title,
      url: new URL(pathname, metadata.metadataBase),
    },
    twitter: {
      card: 'summary',
      title: metadata.title,
      description: metadata.description,
      site: '@evaluatedotrun',
      creator: '@apteryxxyz',
    },
  } satisfies Metadata;
}
