import { z } from 'zod';
import { ExecuteOptions } from './execute.js';

export type PartialRuntime = z.infer<typeof PartialRuntime>;
export const PartialRuntime = z.object({
  id: z.string(),
  versions: z.array(z.string()),
  name: z.string(),
  aliases: z.array(z.string()),
  popularity: z.number().min(0).max(100),
  tags: z.array(z.string()),
  icon: z.string().optional(),
});

export type Runtime = z.infer<typeof Runtime>;
export const Runtime = PartialRuntime.merge(
  z.object({
    examples: ExecuteOptions.merge(z.object({ name: z.string() }))
      .omit({ runtime: true })
      .array(),
  }),
);

export type PistonRuntime = z.infer<typeof PistonRuntime>;
export const PistonRuntime = z.object({
  language: z.string(),
  version: z.string(),
  aliases: z.array(z.string()),
  runtime: z.string().optional(),
});
