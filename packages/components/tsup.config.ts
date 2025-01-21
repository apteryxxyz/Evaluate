import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/*.{ts,tsx}'],
  format: 'esm',
  dts: true,
  noExternal: ['@evaluate/helpers'], // Needed for the browser extension
});
