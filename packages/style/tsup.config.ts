import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/tailwind.preset.ts'],
  format: 'esm',
  dts: true,
});
