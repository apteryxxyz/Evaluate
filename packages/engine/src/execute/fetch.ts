import { betterFetch } from '@evaluate/helpers/better-fetch';
import {
  ExecuteOptions,
  ExecuteResult,
  PistonExecuteOptions,
  PistonExecuteResult,
} from '@evaluate/shapes';
import { extractIdentifier } from '~/runtimes/identifier.js';
import { getRuntime } from '~/runtimes/index.js';
import { parseArguments } from './arguments.js';

/**
 * Execute code using the Piston API.
 * @param options {@link ExecuteOptions} for the execution.
 * @returns ​{@link ExecuteResult} of the execution.
 */
export async function executeCode(
  options: ExecuteOptions,
): Promise<ExecuteResult> {
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

  const response = await betterFetch('https://emkc.org/api/v2/piston/execute', {
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
