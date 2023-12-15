/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/components/**/*.{ts,tsx}',
  ],
  presets: [require('@evaluate/ui/tailwind.config.cjs')],
  // theme: {
  //   extend: {
  //     fontFamily: {
  //       sans: ['var(--font-geist-sans)'],
  //       mono: ['var(--font-geist-mono)'],
  //     },
  //   },
  // },
};
