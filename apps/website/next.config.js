import withBundleAnalyser from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  redirects: () => [
    {
      source: '/products/discord-bot',
      destination:
        'https://discord.com/api/oauth2/authorize?client_id=946755134443102258&permissions=0&scope=bot%20applications.commands',
      permanent: false,
    },
    {
      source: '/language(s)?/:id*',
      destination: '/:id*',
      permanent: false,
    },
    {
      source: '/translate',
      destination: 'https://translate.evaluate.run/',
      permanent: true,
    },
  ],

  rewrites: () => [
    {
      source: '/api/send',
      destination: 'https://us.umami.is/api/send',
    },
    {
      source: '/ingest/:path*',
      destination: 'https://app.posthog.com/ingest/:path*',
    },
  ],

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default withBundleAnalyser({
  enabled: process.env.ANALYSE === 'true',
})(nextConfig);
