import type { MetadataRoute } from 'next/types';
import { absoluteUrl } from '~/utilities/url-helpers';

export default function Robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api', '/_next', '/static'],
      },
    ],
    host: absoluteUrl(),
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
