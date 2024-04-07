/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/**/*', '../../packages/react/src/components/**/*'],
  presets: [require('@evaluate/react/tailwind.config.js')],
};
