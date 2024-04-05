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
    host: new URL(env.NEXT_PUBLIC_WEBSITE_URL).host,
    sitemap: `${env.NEXT_PUBLIC_WEBSITE_URL}/sitemap.xml`,
  };
}
