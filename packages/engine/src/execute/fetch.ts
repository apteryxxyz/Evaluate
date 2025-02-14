import fetch2 from '@evaluate/helpers/fetch';
import {
  ExecuteOptions,
  ExecuteResult,
  PistonExecuteOptions,
  PistonExecuteResult,
} from '@evaluate/shapes';
import { getRuntime } from '~/runtimes';
import { extractIdentifier } from '~/runtimes/identifier';
import { parseArguments } from './arguments';

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

  const body = PistonExecuteOptions.parse({
    language,
    version,
    files: Object.entries(options.files)
      .map(([name, content]) => ({ name, content }))
      .sort((a, b) => {
        if (options.entry === a.name) return -1;
        if (options.entry === b.name) return 1;
        return 0;
      }),
    stdin: options.input,
    args: options.args ? parseArguments(options.args) : undefined,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const response = await fetch2('https://emkc.org/api/v2/piston/execute', {
    signal: controller.signal,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).finally(() => clearTimeout(timeout));
  const json = await response.json();

  try {
    const result = PistonExecuteResult.parse(json);
    return ExecuteResult.parse(result);
  } catch (error) {
    console.error('Error parsing incoming json', error, json);
    throw new Error('An error occurred while parsing the response');
  }
}
