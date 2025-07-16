import { chromeExtension } from '@crxjs/vite-plugin';
import tailwindCss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import zipPack from 'vite-plugin-zip-pack';
import tsconfigPaths from 'vite-tsconfig-paths';
import manifest from './manifest.json';
import {
  removeExternalScriptLoading,
  replaceJsonImports,
} from './vite-plugins';

export default defineConfig({
  plugins: [
    removeExternalScriptLoading(),
    replaceJsonImports(),
    tailwindCss(),
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
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
