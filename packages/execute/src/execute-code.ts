// @ts-expect-error 7016 - lexure has bad types
import { Lexer, Parser, longShortStrategy } from 'lexure';
import { z } from 'zod';
import { LanguageSchema } from './fetch-languages';

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

const PistonExecuteCodeResultSchema = z.object({
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

/**
 * Execute code using the Piston API.
 * @param _output that will be passed to the Piston API
 * @returns the result of the execution
 */
export async function executeCode(_output: ExecuteCodeOptions) {
  const options = ExecuteCodeOptionsSchema.parse(_output);
  const language = options.language.id.split('/');

  const result = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: (language[1] ?? language[0])
        ?.replaceAll('dot', '.')
        .replaceAll('plus', '+'),
      version: options.language.version,
      files: options.files,
      stdin: options.input,
      args: options.args ? parseArguments(options.args) : undefined,
    }),
  })
    .then((response) => response.json())
    .then(PistonExecuteCodeResultSchema.parse);

  return {
    success:
      result.run.code === 0 && (!result.compile || result.compile.code === 0),
    run: {
      success: result.run.code === 0,
      output: result.run.output,
    },
    compile: result.compile
      ? {
          success: result.compile.code === 0,
          output: result.compile.output,
        }
      : undefined,
  };
}
export type ExecuteCodeResult = Awaited<ReturnType<typeof executeCode>>;

/** Parse command line arguments. */
function parseArguments(args: string): string[] {
  const tokens = new Lexer(args)
    .setQuotes([
      ['"', '"'],
      ['“', '”'],
    ])
    .lex();

  return new Parser(tokens)
    .setUnorderedStrategy(longShortStrategy())
    .parse()
    .ordered.map((token: { value: string }) => token.value);
}
