import { z } from 'zod';

export type ExecuteOptions = z.infer<typeof ExecuteOptions>;
export const ExecuteOptions = z
  .object({
    runtime: z
      .string({ required_error: 'A runtime is required' })
      .regex(/^(?:[\w]+\+)?[\w]+(?:@[\d.]+)?$/, 'Invalid runtime format'),
    files: z
      .record(
        z
          .string({ required_error: 'File path is required' })
          .max(200, 'File path length is too long'),
        z
          .string({ required_error: 'File content is required' })
          .max(10_000, 'File content is too large'),
        {
          required_error: 'At least one file is required',
          invalid_type_error: 'Files must be an object',
        },
      )
      .refine((f) => Object.keys(f).length >= 0, 'Too few files')
      .refine((f) => Object.keys(f).length <= 10, 'Too many files')
      .refine(
        (f) =>
          Object.values(f).reduce((acc, val: string) => acc + val.length, 0) <=
          10_000,
        'Combined file content size is too large',
      ),
    entry: z.string({ required_error: 'An entry file is required' }),
    input: z.string().max(2_000, 'Input length is too long').optional(),
    args: z.string().max(2_000, 'Arguments length is too long').optional(),
  })
  .refine((data) => {
    // Omit is used elsewhere to remove files, so we need to check if it exists
    if (!data.files) return true;
    return data.entry in data.files;
  }, 'Entry file does not exist');

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

/**
 * Structure that is returned from the Piston API when executing code.
 */
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
