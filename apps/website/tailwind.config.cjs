/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*', '../../packages/ui/src/components/**/*'],
  presets: [require('@evaluate/ui/tailwind.config.cjs')],
};
