import { defineConfig } from 'tsup';
import sayable from 'unplugin-sayable/esbuild';

export default defineConfig({
  entry: ['src/index.ts', 'src/env.ts'],
  format: 'esm',
  dts: true,
  esbuildPlugins: [sayable()],
});
