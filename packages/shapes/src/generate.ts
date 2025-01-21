import { z } from 'zod';

export type GenerateCodeOptions = z.infer<typeof GenerateCodeOptions>;
export const GenerateCodeOptions = z.object({
  file: z.object({
    name: z.string(),
    content: z.string().max(1000, { message: 'File content is too large' }),
    line: z.number(),
  }),
  instructions: z
    .string({ required_error: 'Instructions are required' })
    .min(1, { message: 'Instructions are required' })
    .max(500, { message: 'Instructions are too long' }),
});

export type GenerateCodeInstructionsOnlyOptions = z.infer<
  typeof GenerateCodeInstructionsOnlyOptions
>;
export const GenerateCodeInstructionsOnlyOptions = GenerateCodeOptions.pick({
  instructions: true,
});
