const twComponentsPreset = require('@evaluate/components/tailwind-preset');
const twStylesPreset = require('@evaluate/style/tailwind-preset');

/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  presets: [twStylesPreset, twComponentsPreset],
  content: ['./src/**/**/*']
    .concat(twStylesPreset.content)
    .concat(twComponentsPreset.content),
};

module.exports = tailwindConfig;

console.log('tailwind.config.cjs', tailwindConfig.presets);
