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
  ],
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

const isTruthy = (v) => ['true', 't', '1'].includes(v);
export default withBundleAnalyser({
  enabled: isTruthy(String(process.env.ANALYSE)),
})(nextConfig);
