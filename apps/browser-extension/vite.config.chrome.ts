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
      browser: 'chrome',
      manifest: manifest as never,
    }),
    zipPack({
      inDir: 'dist/chrome',
      outDir: 'dist',
      outFileName: 'chrome.zip',
    }),
  ],
  build: {
    outDir: 'dist/chrome',
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
