import type { MetadataRoute } from 'next';
import say from '~/i18n';

export default async function Manifest(): Promise<MetadataRoute.Manifest> {
  await say.load();

  const [manifest, ...shortcuts] = say.map((say, locale) => ({
    name: 'Evaluate',
    short_name: 'Evaluate',
    description: say`Test code in any programming language with Evaluate! Run code snippets in your browser, without installing anything.`,
    url: locale === say.locales[0] ? '/' : `/${locale}`,
  }));

  return {
    name: manifest!.name,
    short_name: manifest!.short_name,
    description: manifest!.description,
    theme_color: '#2fc186',
    background_color: '#ffffff',
    scope: '/',
    start_url: '/',
    icons: [
      { src: '/images/icon/192.png', sizes: '192x192', type: 'image/png' },
      { src: '/images/icon/512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcuts,
  };
}
