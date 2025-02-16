import { chromeExtension } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import zipPack from 'vite-plugin-zip-pack';
import tsconfigPaths from 'vite-tsconfig-paths';
import manifest from './manifest.json';
import { removeExternalScriptLoading } from './vite-plugins';

export default defineConfig({
  plugins: [
    removeExternalScriptLoading(),
    tsconfigPaths(),
    react(),
    chromeExtension({
      browser: 'firefox',
      manifest: manifest as never,
    }),
    zipPack({
      inDir: 'dist/firefox',
      outDir: 'dist',
      outFileName: 'firefox.zip',
    }),
  ],
  build: {
    outDir: 'dist/firefox',
    minify: false,
  },
});
