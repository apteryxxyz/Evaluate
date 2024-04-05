import { defineConfig } from '@configs/tsup';

export default defineConfig({
  entry: ['src/*.ts', 'src/loader/config.ts'],
  bundle: false,
});
