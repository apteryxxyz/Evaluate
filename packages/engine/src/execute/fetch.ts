import { getRuntime } from '~/runtimes';
import { extractIdentifier } from '~/runtimes/identifier';
import { parseArguments } from './arguments';
import {
  ExecuteOptions,
  ExecuteResult,
  PistonExecuteOptions,
  PistonExecuteResult,
} from './schemas';

/**
 * Execute code using the Piston API.
 * @param options that will be passed to the Piston API
 * @returns the result of the execution
 */
export async function executeCode(options: ExecuteOptions) {
  options = ExecuteOptions.parse(options);
  const runtime = await getRuntime(options.runtime);
  if (!runtime) throw new Error('Runtime not found');

  let [identifier, version = 'latest'] = options.runtime.split('@');
  const { language } = extractIdentifier(identifier!);
  if (version === 'latest') version = runtime.versions.at(-1)!;

  const result = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      PistonExecuteOptions.parse({
        language,
        version,
        files: Object.entries(options.files)
          .map(([name, content]) => ({ name, content }))
          .toSorted((a, b) => {
            if (options.entry === a.name) return -1;
            if (options.entry === b.name) return 1;
            return 0;
          }),
        stdin: options.input,
        args: options.args ? parseArguments(options.args) : undefined,
      }),
    ),
  })
    .then((response) => response.json())
    .then(PistonExecuteResult.parse);

  return ExecuteResult.parse(result);
}
