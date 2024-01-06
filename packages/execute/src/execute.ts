import { parseArguments } from './arguments';
import {
  type ExecuteCodeOptions,
  ExecuteCodeOptionsSchema,
  type ExecuteCodeResult,
  ExecuteCodeResultSchema,
  PistonExecuteCodeResultSchema,
} from './schemas';

/**
 * Execute code using the Piston API.
 * @param options that will be passed to the Piston API
 * @returns the result of the execution
 */
export async function executeCode(
  options: ExecuteCodeOptions,
): Promise<ExecuteCodeResult> {
  options = ExecuteCodeOptionsSchema.parse(options);
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

  return ExecuteCodeResultSchema.parse({
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
  });
}
