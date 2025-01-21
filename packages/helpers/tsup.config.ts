import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/*/index.{ts,tsx}'],
  format: 'esm',
  dts: true,
});
