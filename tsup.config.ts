import { defineConfig } from 'tsup';
import { esbuildDecorators } from '@anatine/esbuild-decorators';

export default defineConfig({
    entry: ['src/**/**/*.ts'],
    outDir: 'build',
    clean: true,

    format: ['cjs'],
    bundle: false,
    minify: false,
    skipNodeModulesBundle: true,
    target: 'esnext',
    keepNames: true,

    // @ts-ignore Need decorators
    esbuildPlugins: [esbuildDecorators()],
});
