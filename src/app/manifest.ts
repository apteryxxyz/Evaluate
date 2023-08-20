import type { MetadataRoute } from 'next/types';

export default function manifest() {
  return {
    theme_color: '#3A86F8',
    background_color: '#FFFFFF',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    name: 'Qwaroo',
    short_name: 'Qwaroo',
    description:
      'Higher or Lower on a whole new level, play one of the many games we have to offer, or create your own and share it with your friends!',
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
