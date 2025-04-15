import { z } from 'zod';

export type ExecuteOptions = z.infer<typeof ExecuteOptions>;
export const ExecuteOptions = z
  .object({
    runtime: z
      .string({ error: 'A runtime is required' })
      .regex(/^(?:[\w]+\+)?[\w]+(?:@[\d.]+)?$/, {
        error: 'Invalid runtime format',
      }),
    files: z
      .record(
        z
          .string({ error: 'File path is required' })
          .max(200, { error: 'File path length is too long' }),
        z
          .string({ error: 'File content is required' })
          .max(10_000, { error: 'File content is too large' }),
        {
          error: (issue) =>
            issue.input === undefined
              ? 'At least one file is required'
              : 'Files must be an object',
        },
      )
      .refine((f) => Object.keys(f).length >= 0, { error: 'Too few files' })
      .refine((f) => Object.keys(f).length <= 10, { error: 'Too many files' })
      .refine(
        (f) =>
          Object.values(f).reduce((acc, val: string) => acc + val.length, 0) <=
          10_000,
        { error: 'Combined file content size is too large' },
      ),
    entry: z.string({ error: 'An entry file is required' }),
    input: z
      .string()
      .max(2_000, { error: 'Input length is too long' })
      .optional(),
    args: z
      .string()
      .max(2_000, { error: 'Arguments length is too long' })
      .optional(),
  })
  .refine(
    (data) => {
      // Omit is used elsewhere to remove files, so we need to check if it exists
      if (!data.files) return true;
      return data.entry in data.files;
    },
    { error: 'Entry file does not exist' },
  );

export type ExecuteResult = z.infer<typeof ExecuteResult>;
export const ExecuteResult = z.object({
  run: z.object({
    output: z.string(),
    signal: z.string().nullable(),
    code: z.number().nullable(),
  }),
  compile: z
    .object({
      output: z.string(),
      signal: z.string().nullable(),
      code: z.number().nullable(),
    })
    .optional(),
});

export type PistonExecuteOptions = z.infer<typeof PistonExecuteOptions>;
export const PistonExecuteOptions = z.object({
  language: z.string(),
  version: z.string(),
  files: z.object({ name: z.string(), content: z.string() }).array().nonempty(),
  stdin: z.string().optional(),
  args: z.string().array().optional(),
  compile_timeout: z.number().optional(),
  run_timeout: z.number().optional(),
});

export type PistonExecuteResult = z.infer<typeof PistonExecuteResult>;
export const PistonExecuteResult = z.object({
  language: z.string(),
  version: z.string(),
  run: z.object({
    stdout: z.string(),
    stderr: z.string(),
    output: z.string(),
    code: z.number().nullable(),
    signal: z.string().nullable(),
  }),
  compile: z
    .object({
      stdout: z.string(),
      stderr: z.string(),
      output: z.string(),
      code: z.number().nullable(),
      signal: z.string().nullable(),
    })
    .optional(),
});
