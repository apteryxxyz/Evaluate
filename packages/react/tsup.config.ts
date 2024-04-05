import { exec } from 'node:child_process';
import { join } from 'node:path';
import { defineConfig } from '@configs/tsup';
import {
  readFile,
  readdir as listDirectory,
  writeFile,
} from 'node:fs/promises';

export default defineConfig({
  entry: ['src/**/*'],
  bundle: false,
  async onSuccess() {
    // filter over src/components looking for .ts files that have `"use client"` at the top
    // then loop over each compiled file in dist/components and add `"use client"` to the top

    exec('resolve-tspaths');

    const componentsSourceDirectory = join(__dirname, 'src/components');
    const componentsBuildDirectory = join(__dirname, 'dist/components');

    for (const file of await listDirectory(componentsSourceDirectory)) {
      const path = join(componentsSourceDirectory, file);
      const content = await readFile(path, 'utf-8');

      if (content.includes('use client')) {
        const compiledPath = join(
          componentsBuildDirectory,
          file.replace('.tsx', '.js'),
        );
        const compiledContent = await readFile(compiledPath, 'utf-8');
        await writeFile(compiledPath, `"use client"\n${compiledContent}`);
      }
    }
  },
});
