import type { Runtime } from '@evaluate/runtimes';
import { compress } from './compress.js';
import {
  type CodeOptions,
  ExecuteOptions,
  type FilesOptions,
} from './shapes.js';

export function makePickRuntimePathname(options: CodeOptions | FilesOptions) {
  const state = compress(ExecuteOptions.from(options));
  return `/playgrounds#${state}` as const;
}

export function makeEditCodePathname(
  runtime: Runtime,
  options: CodeOptions | FilesOptions,
) {
  const state = compress(ExecuteOptions.from(options));
  return `/playgrounds/${runtime.id}#${state}` as const;
}
