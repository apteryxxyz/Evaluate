import { defineConfig } from '@configs/tsup';

export default defineConfig({
  entry: ['src/*.ts'],
  bundle: false,
});
