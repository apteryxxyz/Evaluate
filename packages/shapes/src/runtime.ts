import { z } from 'zod';
import { ExecuteOptions } from './execute.js';

export type PartialRuntime = z.infer<typeof PartialRuntime>;
export const PartialRuntime = z.object({
  id: z.string(),
  versions: z.string().array(),
  name: z.string(),
  aliases: z.string().array(),
  popularity: z.number().min(0).max(100),
  tags: z.string().array(),
  icon: z.string().optional(),
});

export type Runtime = z.infer<typeof Runtime>;
export const Runtime = PartialRuntime.extend({
  examples: ExecuteOptions.omit({ runtime: true })
    .extend({ name: z.string() })

    .array(),
});

export type PistonRuntime = z.infer<typeof PistonRuntime>;
export const PistonRuntime = z.object({
  language: z.string(),
  version: z.string(),
  aliases: z.string().array(),
  runtime: z.string().optional(),
});
