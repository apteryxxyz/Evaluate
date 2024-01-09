import { execSync } from 'node:child_process';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
export function defineConfig(options) {
  if (!options.entry) throw new Error("Must have 'entry'");
  return Object.assign(
    {
      skipNodeModulesBundle: true,
      //
      platform: 'node',
      format: ['esm'],
      target: 'es2022',
      //
      clean: true,
      splitting: true,
      bundle: true,
      treeshake: true,
      keepNames: true,
      minifySyntax: true,
      //
      dts: true,
      sourcemap: false,
    },
    options,
  );
}
export function runCommand(command) {
  return promisify(execSync)(command);
}
export function beforeExit(action) {
  const handler = (code) => code === 0 && action();
  process.on('beforeExit', handler);
  return () => process.off('beforeExit', handler);
}
export function readFile(filePath) {
  return fs.readFile(filePath, 'utf-8');
}
export function writeFile(filePath, content) {
  return fs.writeFile(filePath, content);
}
export function listDirectory(directoryPath) {
  return fs.readdir(directoryPath);
}
export async function injectVersion(directoryPath = 'dist') {
  const json = await readFile('package.json').then(JSON.parse);
  const filePromises = (await listDirectory(directoryPath)).map(
    async (fileName) => {
      if (!fileName.includes('.')) return;
      const fullPath = path.join(directoryPath, fileName);
      const contents = await readFile(fullPath);
      const replaced = contents.replace(/\{\{version\}\}/g, json.version);
      await writeFile(fullPath, replaced);
    },
  );
  await Promise.all(filePromises);
}
export async function addExports(fromDirectory, toDirectory = '') {
  const json = await readFile('package.json').then(JSON.parse);
  const sourceDirectory = path.join('src', fromDirectory);
  const distDirectory = path.join('dist', fromDirectory);
  for (const fileName of await listDirectory(sourceDirectory)) {
    const cleanName = fileName.replace('.ts', '');
    const inputPath = path
      .join(toDirectory, cleanName)
      .replaceAll(path.sep, '/');
    const exportPath = path
      .join(distDirectory, cleanName)
      .replaceAll(path.sep, '/');
    json.exports[`./${inputPath}`] = {
      import: `./${exportPath}.mjs`,
      require: `./${exportPath}.cjs`,
      types: `./${exportPath}.d.ts`,
    };
  }
  await writeFile('package.json', JSON.stringify(json));
}
