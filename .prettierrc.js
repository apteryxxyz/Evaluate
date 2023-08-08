/** @type {import('prettier').Config} */
module.exports = {
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    // 'prettier-plugin-tailwindcss',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  // tailwindConfig: './packages/config/tailwind/base.js',
  importOrder: ['<THIRD_PARTY_MODULES>', '^@/(.*)$', '^[./]'],
  singleQuote: true,
};
