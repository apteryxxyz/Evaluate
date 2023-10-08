/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { domains: ['japi.rest'] },
  redirects: async () => require('./vercel.json').redirects ?? [],
  rewrites: async () => require('./vercel.json').rewrites ?? [],
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer');

module.exports = withBundleAnalyzer({
  enabled: process.env['ANALYZE'] === 'true',
})(nextConfig);
