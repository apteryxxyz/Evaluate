import { pickBy } from 'es-toolkit/object';
import z from 'zod';

//

export const CodeOptions = Object.assign(
  z.object({
    code: z.string(),
    args: z.string().optional(),
    input: z.string().optional(),
  }),
  {
    from(value: CodeOptions | FilesOptions): CodeOptions {
      if ('code' in value) return value;
      return CodeOptions.parse(
        pickBy(
          {
            args: value.files['::args::'],
            input: value.files['::input::'],
            code: value.files[value.entry],
          },
          (v) => v !== undefined,
        ),
      );
    },
  },
);

export type CodeOptions = z.infer<typeof CodeOptions>;

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

export type FilesOptions = z.infer<typeof FilesOptions>;

export const ExecuteOptions = Object.assign(
  FilesOptions.and(
    z.object({
      focused: z.string().optional(),
    }),
  )
    .refine((o) => !o.focused || o.focused in o.files, {
      error: 'Focused file does not exist',
    })
    .transform((o) => {
      const [codeLength, codeLines] = Object.values(o.files).reduce(
        ([length, lines], file) => [
          length + file.length,
          lines + file.split('\n').length,
        ],
        [0, 0],
      );

      return {
        ...o,
        lines: codeLines,
        length: codeLength,
        focused: o.focused ?? o.entry,
      };
    }),
  {
    from(value: CodeOptions | FilesOptions): ExecuteOptions {
      if ('code' in value) {
        return ExecuteOptions.parse({
          files: pickBy(
            {
              '::args::': value.args,
              '::input::': value.input,
              'file.code': value.code,
            },
            (v) => v !== undefined,
          ),
          entry: 'file.code',
        });
      } else {
        return ExecuteOptions.parse(value);
      }
    },
  },
);

export type ExecuteOptions = z.infer<typeof ExecuteOptions>;

export const ExecutionPhaseResult = z
  .object({
    output: z.string().transform((o) => o.trim() || undefined),
    signal: z.string().nullable(),
    code: z.number().nullable(),
  })
  .transform((r) => ({
    ...r,
    success: r.code === 0,
    expired: r.signal === 'SIGKILL',
  }));

export type ExecutionPhaseResult = z.infer<typeof ExecutionPhaseResult>;

export const ExecuteResult = z
  .object({
    run: ExecutionPhaseResult,
    compile: ExecutionPhaseResult.optional(),
  })
  .transform((r) => ({
    ...r,
    success: r.run.success && (!r.compile || r.compile.success),
    expired: Boolean(r.run.expired || r.compile?.expired),
    output: (r.compile?.code || 0) > 0 ? r.compile?.output : r.run?.output,
  }));

export type ExecuteResult = z.infer<typeof ExecuteResult>;
