import z from 'zod';
import { parseArguments } from './arguments.js';
import { Callable } from './callable.js';
import { type Client, FETCH } from './client.js';
import { decodeRuntimeId, getRuntimeDefaultFileName } from './getters.js';
import type { Runtime } from './runtimes.js';

// export const CodeOptions = type({
//   code: 'string',
//   'args?': 'string',
//   'input?': 'string',
// });

export const CodeOptions = z.object({
  code: z.string(),
  args: z.string().optional(),
  input: z.string().optional(),
});

export const FilesOptions = z
  .object({
    files: z
      .object({
        '::args::': z.string(),
        '::input::': z.string(),
      })
      .partial()
      .catchall(z.string()),
    entry: z.string({ error: 'Entry file is required' }),
  })
  .refine((o) => o.entry in o.files, {
    error: 'Entry file does not exist',
  });

export const ExecuteOptions = Object.assign(
  FilesOptions.and(z.object({ focused: z.string().optional() }))
    .refine((o) => !o.focused || o.focused in o.files, {
      error: 'Focused file does not exist',
    })
    .transform((o) => {
      const [length, lines] = Object.values(o.files).reduce(
        ([r, c], f) => [r + f.length, c + f.split('\n').length],
        [0, 0],
      );
      return { ...o, lines, length, focused: o.focused ?? o.entry };
    }),
  {
    fromOptions(
      value: typeof CodeOptions._output | typeof FilesOptions._output,
    ) {
      if ('code' in value) {
        return ExecuteOptions.parse({
          files: {
            ...(value.args && { '::args::': value.args }),
            ...(value.input && { '::input::': value.input }),
            'file.code': value.code,
          },
          entry: 'file.code',
        });
      } else {
        return ExecuteOptions.parse(value);
      }
    },
  },
);

//

export const ExecutionStageResult = z
  .object({
    output: z.string().trim(),
    signal: z.string().nullable(),
    code: z.number().nullable(),
  })
  .transform((r) => ({
    ...r,
    success: r.code === 0,
    expired: r.signal === 'SIGKILL',
  }));

export const ExecuteResult = z
  .object({
    run: ExecutionStageResult,
    compile: ExecutionStageResult.optional(),
  })
  .transform((r) => ({
    ...r,
    success: r.run.success && (!r.compile || r.compile.success),
    expired: Boolean(r.run.expired || r.compile?.expired),
    output: (r.compile?.code || 0) > 0 ? r.compile?.output : r.run?.output,
  }));

//

export class Execute extends Callable<
  (
    runtime: typeof Runtime._output,
    options: typeof CodeOptions._input | typeof FilesOptions._input,
  ) => Promise<
    [typeof ExecuteResult._output, typeof ExecuteOptions._output] &
      typeof ExecuteResult._output
  >
> {
  constructor(client: Client) {
    super(async (runtime, options_) => {
      const [language] = decodeRuntimeId(runtime.id)!;
      const options = ExecuteOptions.fromOptions(options_);

      if ('file.code' in options.files) {
        const name = getRuntimeDefaultFileName(runtime.id);
        if (name) {
          options.files[name] = options.files['file.code'];
          delete options.files['file.code'];
          options.entry = options.focused = name;
        }
      }

      const body = {
        language,
        version: runtime.version,
        files: Object.entries(options.files)
          .filter(([name]) => !name.startsWith('::'))
          .map(([n, c]) => ({ name: n, content: c }))
          .sort((a) => (options.entry === a.name ? -1 : 1)),
        stdin: options.files['::input::'],
        args: parseArguments(options.files['::args::']),
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await client[FETCH]('/execute', {
        signal: controller.signal,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).finally(() => clearTimeout(timeout));
      const json = await response.json();

      const result = ExecuteResult.parse(json);
      return Object.assign(
        [result, options] satisfies [unknown, unknown],
        result,
      );
    });
  }
}
