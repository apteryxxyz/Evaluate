import type { MetadataRoute } from 'next/types';
import { env } from '~/env';

export default function Robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api', '/_next', '/static'],
      },
    ],
    host: new URL(env.WEBSITE_URL).host,
    sitemap: `${env.WEBSITE_URL}/sitemap.xml`,
  };
}
