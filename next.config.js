/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  redirects: async () => [
    {
      source: '/invite',
      destination:
        'https://discord.com/api/oauth2/authorize?client_id=946755134443102258&permissions=0&scope=bot%20applications.commands',
      permanent: false,
    },
  ],
};

module.exports = nextConfig;
