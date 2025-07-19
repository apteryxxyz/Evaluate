import z from 'zod/v4';

export const Runtime = z.object({
  id: z.string(),
  version: z.string(),
  name: z.string(),
  aliases: z.array(z.string()),
  popularity: z.number(),
  tags: z.array(z.string()),
});
export type Runtime = z.infer<typeof Runtime>;

export const PistonRuntime = z.object({
  language: z.string(),
  version: z.string(),
  runtime: z.string().optional(),
  aliases: z.array(z.string()),
});
export type PistonRuntime = z.infer<typeof PistonRuntime>;
