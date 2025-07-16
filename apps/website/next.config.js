// TODO: Bug in Next.js 15.4.x, cannot upgrade, see https://github.com/vercel/next.js/issues/81628

import { fetchRuntimes } from '@evaluate/engine/runtimes';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },

  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/playgrounds',
        permanent: false,
      },
      {
        source: `/:slug(${(await fetchRuntimes())
          .map((r) => r.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          .join('|')})`,
        destination: '/playgrounds/:slug',
        permanent: true,
      },
    ];
  },
  rewrites: async () => [
    {
      source: '/api/ingest/static/:path*',
      destination: 'https://us-assets.i.posthog.com/static/:path*',
    },
    {
      source: '/api/ingest/:path*',
      destination: 'https://us.i.posthog.com/:path*',
    },
  ],
  skipTrailingSlashRedirect: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/PKief/vscode-material-icon-theme/main/icons/**',
      },
    ],
  },
};

const truthy = (v) => ['true', 't', '1'].includes(v);
export default [
  truthy(process.env.ANALYSE) &&
    (await import('@next/bundle-analyzer')).default({ enabled: true }),
  !truthy(process.env.TURBOPACK) &&
    (await import('@million/lint')).next({ rsc: true }),
]
  .filter(Boolean)
  .reduce((acc, curr) => curr(acc), nextConfig);
