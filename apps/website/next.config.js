import withBundleAnalyser from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

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
  ],

  rewrites: async () => [
    {
      source: '/api/v1/ingest/:path*',
      destination: 'https://app.posthog.com/:path*',
    },
  ],

  poweredByHeader: false,

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

export default withBundleAnalyser({
  enabled: process.env.ANALYSE === 'true',
})(nextConfig);
