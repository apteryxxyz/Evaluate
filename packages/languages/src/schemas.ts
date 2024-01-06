import { z } from 'zod';

export type Language = z.infer<typeof LanguageSchema>;
export const LanguageSchema = z.object({
  id: z.string(),
  key: z.string(),
  version: z.string(),
  short: z.string(),
  name: z.string(),
  aliases: z.array(z.string()).optional(),
  runtime: z
    .object({
      id: z.string(),
      key: z.string(),
      name: z.string(),
    })
    .optional(),
});

export type PistonRuntime = z.infer<typeof PistonRuntimeSchema>;
export const PistonRuntimeSchema = z.object({
  language: z.string(),
  version: z.string(),
  runtime: z.string().optional(),
  aliases: z.array(z.string()).optional(),
});
