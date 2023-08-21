import { Lexer, longShortStrategy, Parser } from 'lexure';
import { z } from 'zod';
import { languageSchema } from './languages';

export const executeCodeOptionsSchema = z.object({
  language: languageSchema,
  files: z.array(
    z.object({
      name: z.string().optional(),
      content: z.string(),
      encoding: z.string().optional(),
    }),
  ),
  input: z.string().optional(),
  args: z.string().optional(),
});

export const pistonExecuteResultSchema = z.object({
  language: z.string(),
  version: z.string(),
  run: z.object({
    stdout: z.string(),
    stderr: z.string(),
    output: z.string(),
    code: z.number(),
    signal: z.string().nullable(),
  }),
  compile: z
    .object({
      stdout: z.string(),
      stderr: z.string(),
      output: z.string(),
      code: z.number(),
      signal: z.string().nullable(),
    })
    .optional(),
});

export type ExecuteCodeOptions = z.infer<typeof executeCodeOptionsSchema>;
export type ExecuteCodeResult = Awaited<ReturnType<typeof executeCode>>;

/** Execute code using the Piston API. */
export async function executeCode(options: ExecuteCodeOptions) {
  const language = options.language.id.split('/');

  const result = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: language[1] ?? language[0],
      version: options.language.version,
      files: options.files,
      stdin: options.input,
      args: options.args ? parseArguments(options.args) : undefined,
    }),
  })
    .then((response) => response.json())
    .then((result) => pistonExecuteResultSchema.parse(result));

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

/** Parse command line arguments. */
function parseArguments(args: string) {
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
