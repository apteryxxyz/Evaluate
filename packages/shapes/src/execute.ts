import { z } from 'zod/v4';

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
        z.string({ error: 'File path is required' }),
        z.string({ error: 'File content is required' }),
        {
          error: (issue) =>
            issue.input === undefined
              ? 'At least one file is required'
              : 'Files must be an object',
        },
      )
      .refine((f) => Object.keys(f).length >= 0, { error: 'Too few files' }),
    entry: z.string({ error: 'An entry file is required' }),
    input: z.string().optional(),
    args: z.string().optional(),
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
