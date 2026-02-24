import {
  type CodeOptions,
  ExecuteOptions,
  type FilesOptions,
} from '../execute.js';
import type { Runtime } from '../runtimes.js';
import { compress } from './compress.js';

export function makePickRuntimePathname(
  options: typeof CodeOptions._input | typeof FilesOptions._input,
) {
  const state = compress(ExecuteOptions.fromOptions(options));
  return `/playgrounds#${state}` as const;
}

export function makeEditCodePathname(
  runtime: typeof Runtime._output,
  options: typeof CodeOptions._input | typeof FilesOptions._input,
) {
  const state = compress(ExecuteOptions.fromOptions(options));
  return `/playgrounds/${runtime.id}#${state}` as const;
}
