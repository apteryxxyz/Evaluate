import { fetchRuntimes } from '@evaluate/engine/runtimes';
import withBundleAnalyser from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },

  redirects: async () => [
    {
      source: '/',
      destination: '/playgrounds',
      permanent: false,
    },
    {
      source: '/language(s)?/:slug*',
      destination: '/playgrounds',
      permanent: false,
    },
    {
      source: `/:slug(${(await fetchRuntimes())
        .map((r) => r.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|')})`,
      destination: '/playgrounds/:slug',
      permanent: false,
    },
  ],
  rewrites: async () => [
    {
      source: '/api/v1/ingest/:path*',
      destination: 'https://app.posthog.com/:path*',
    },
    {
      source: '/api/ingest/:path*',
      destination: 'https://app.posthog.com/:path*',
    },
  ],

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

const isTruthy = (v) => ['true', 't', '1'].includes(v);
export default withBundleAnalyser({
  enabled: isTruthy(String(process.env.ANALYSE)),
})(nextConfig);
