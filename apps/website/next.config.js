import { fetchLanguages } from '@evaluate/languages';
import withBundleAnalyser from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  redirects: async () => [
    {
      source: '/products/discord-bot',
      destination:
        'https://discord.com/api/oauth2/authorize?client_id=946755134443102258&permissions=0&scope=bot%20applications.commands',
      permanent: false,
    },
    {
      source: `/:id(${await fetchLanguages().then((l) =>
        l.map((l) => l.id).join('|'),
      )})`,
      destination: '/languages/:id',
      permanent: false,
    },
    {
      source: '/language/:id',
      destination: '/languages/:id',
      permanent: false,
    },
    {
      source: '/translate',
      destination: 'https://translate.evaluate.run/',
      permanent: true,
    },
  ],

  headers: () => [
    {
      source: '/ingest3/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'OPTIONS,GET,POST' },
      ],
    },
  ],

  rewrites: () => [
    {
      source: '/ingest2/:path*',
      destination: 'https://app.posthog.com/:path*',
    },
    {
      source: '/ingest3/:path*',
      destination: 'https://app.posthog.com/:path*',
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
