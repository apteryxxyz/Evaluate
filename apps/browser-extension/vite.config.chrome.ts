import { chromeExtension } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import zipPack from 'vite-plugin-zip-pack';
import tsconfigPaths from 'vite-tsconfig-paths';
import manifest from './manifest.json';

export default defineConfig(({ mode }) => ({
  plugins: [
    tsconfigPaths(),
    react(),
    chromeExtension({
      browser: 'chrome',
      manifest,
    }),
    zipPack({
      inDir: 'dist/chrome',
      outDir: 'dist',
      outFileName: 'chrome.zip',
    }),
  ],
  build: {
    outDir: 'dist/chrome',
    minify: mode === 'production',
  },
}));
