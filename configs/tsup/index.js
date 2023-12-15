import { defineConfig } from 'tsup';

/**
 * @param {import('tsup').Options} options
 */
export default function defineCustomConfig({
  entry = ['src/index.ts'],
  external = [],
  noExternal = [],
  platform = 'node',
  format = ['esm'],
  target = 'es2022',
  skipNodeModulesBundle = true,
  clean = true,
  shims = format.includes('cjs'),
  cjsInterop = format.includes('cjs'),
  minify = false,
  terserOptions = {
    mangle: false,
    keep_classnames: true,
    keep_fnames: true,
  },
  splitting = false,
  keepNames = true,
  dts = true,
  sourcemap = false,
  esbuildPlugins = [],
  treeshake = false,
  ...rest
}) {
  return defineConfig({
    entry,
    external,
    noExternal,
    platform,
    format,
    skipNodeModulesBundle,
    target,
    clean,
    shims,
    cjsInterop,
    minify,
    terserOptions,
    splitting,
    keepNames,
    dts,
    sourcemap,
    esbuildPlugins,
    treeshake,
    ...rest,
  });
}
