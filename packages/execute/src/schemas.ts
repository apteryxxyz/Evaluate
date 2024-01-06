import { LanguageSchema } from '@evaluate/languages';
import { z } from 'zod';

export type ExecuteCodeOptions = z.infer<typeof ExecuteCodeOptionsSchema>;
export const ExecuteCodeOptionsSchema = z.object({
  language: LanguageSchema,
  files: z
    .array(
      z.object({
        name: z
          .string()
          .regex(/^[^\\/*?:"<>|]+$/)
          .max(100)
          .optional(),
        content: z.string().min(1).max(10_000),
      }),
    )
    .min(1)
    .max(10),
  input: z.string().max(2_000).optional(),
  args: z.string().max(2_000).optional(),
});

export type ExecuteCodeResult = z.infer<typeof ExecuteCodeResultSchema>;
export const ExecuteCodeResultSchema = z.object({
  success: z.boolean(),
  run: z.object({
    success: z.boolean(),
    output: z.string(),
  }),
  compile: z
    .object({
      success: z.boolean(),
      output: z.string(),
    })
    .optional(),
});

// Piston

export type PistonExecuteCodeResult = z.infer<
  typeof PistonExecuteCodeResultSchema
>;
export const PistonExecuteCodeResultSchema = z.object({
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
