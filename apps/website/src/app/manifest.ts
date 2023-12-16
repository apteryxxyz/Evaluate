import { getTranslate } from '@evaluate/translate';

export default function Manifest() {
  const t = getTranslate('en');

  return {
    name: 'Evaluate',
    short_name: 'Evaluate',
    theme_color: '#2FC086',
    background_color: '#FFFFFF',
    description: t.seo.description(),
    display: 'standalone',
    lang: 'en',
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
  };
}
