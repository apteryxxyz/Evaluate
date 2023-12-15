import { getLocalisationsFor } from '@evaluate/translate';
import type { MetadataRoute } from 'next/types';

export default function Manifest() {
  // TODO: Localise manifest?
  const description = getLocalisationsFor('seo.description');

  return {
    name: 'Evaluate',
    short_name: 'Evaluate',
    theme_color: '#2FC086',
    background_color: '#FFFFFF',
    description: description.value,
    display: 'standalone',
    lang: 'en-GB',
    scope: '/',
    start_url: '/',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  } satisfies MetadataRoute.Manifest;
}
