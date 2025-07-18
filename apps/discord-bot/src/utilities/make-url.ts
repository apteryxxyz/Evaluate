// TODO: Move with apps/browser-extension/src/helpers/make-url.ts to shared package

import { compress } from '@evaluate/engine/compress';
import { getRuntimeDefaultFileName } from '@evaluate/engine/runtimes';
import env from '~/env';

export function makeEditCodeUrl(options: {
  runtime: string;
  code: string;
  args?: string;
  input?: string;
}) {
  const fileName = getRuntimeDefaultFileName(options.runtime) ?? 'file.code';
  const state = compress({
    files: {
      [fileName]: options.code,
      '::args::': options.args,
      '::input::': options.input,
    },
    entry: fileName,
    focused: fileName,
  });
  return `${env.WEBSITE_URL}playgrounds/${options.runtime}#${state}`;
}

export function makePickRuntimeUrl(options: {
  code: string;
  args?: string;
  input?: string;
}) {
  const state = compress({
    files: {
      'file.code': options.code,
      '::args::': options.args,
      '::input::': options.input,
    },
    entry: 'file.code',
    focused: 'file.code',
  });
  return `${env.WEBSITE_URL}playgrounds#${state}`;
}
