import type { MetadataRoute } from 'next/types';

export default function Robots(): MetadataRoute.Robots {
  const url = 'https://evaluate.run';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api', '/_next', '/static'],
      },
    ],
    host: new URL(url).host,
    sitemap: `${url}/sitemap.xml`,
  };
}
