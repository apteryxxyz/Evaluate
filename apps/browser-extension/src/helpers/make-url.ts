import { compress } from '@evaluate/engine/compress';
import { getRuntimeDefaultFileName } from '@evaluate/engine/runtimes';
import type { PartialRuntime } from '@evaluate/shapes';
import env from '~/env';

export function makeEditCodeUrl(runtime: PartialRuntime, code: string) {
  const fileName = getRuntimeDefaultFileName(runtime.id) ?? 'file.code';
  const state = compress({
    files: { [fileName]: code },
    entry: fileName,
    focused: fileName,
  });
  return `${env.VITE_PUBLIC_WEBSITE_URL}playgrounds/${runtime.id}#${state}`;
}

export function makePickRuntimeUrl(code: string) {
  const state = compress({
    files: { 'file.code': code },
    entry: 'file.code',
    focused: 'file.code',
  });
  return `${env.VITE_PUBLIC_WEBSITE_URL}playgrounds#${state}`;
}
