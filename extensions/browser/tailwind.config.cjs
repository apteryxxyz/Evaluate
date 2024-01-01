/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/react/src/components/**/*.{ts,tsx}',
  ],
  presets: [require('@evaluate/react/tailwind.config.js')],
};
