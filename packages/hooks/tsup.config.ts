import defineConfig from '@config/tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/hooks/*'],
  bundle: false,
});
