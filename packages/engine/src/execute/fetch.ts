import {
  ExecuteOptions,
  ExecuteResult,
  PistonExecuteOptions,
  PistonExecuteResult,
} from '@evaluate/shapes';
import { getRuntime } from '~/runtimes';
import { extractIdentifier } from '~/runtimes/identifier';
import { parseArguments } from './arguments';
import { HttpError, TooManyRequestsError } from './error';

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

  const response = await fetchWithRetry(
    'https://emkc.org/api/v2/piston/execute',
    {
      signal: controller.signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  ).finally(() => clearTimeout(timeout));
  const json = await response.json();

  try {
    const result = PistonExecuteResult.parse(json);
    return ExecuteResult.parse(result);
  } catch (error) {
    console.error('Error parsing incoming json', error, json);
    throw new Error('An error occurred while parsing the response');
  }
}

async function fetchWithRetry(
  url: string | URL,
  options?: RequestInit,
  maxRetries = 3,
  delayFunction = (attempt: number) => 2 ** attempt * 1000,
) {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    const [error, response] = await fetch(url, options)
      .then((response) => [null, response] as const)
      .catch((error: Error) => [error, null] as const);
    if (response?.ok) return response as Response & { ok: true };

    if (error) {
      if (error instanceof Error && error.name === 'AbortError')
        throw new Error('Request was aborted');

      retryCount++;
      if (retryCount < maxRetries) {
        const delay = delayFunction(retryCount);
        console.warn(
          `Request to ${url} failed, retrying in ${delay}ms (${retryCount}/${maxRetries})`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      } else {
        console.error(error);
        throw new Error('An unknown error occurred');
      }
    }

    if (response.status === 429) {
      retryCount++;
      if (retryCount < maxRetries) {
        const delay = delayFunction(retryCount);
        console.warn(
          `Request to ${url} was rate limited, retrying in ${delay}ms (${retryCount}/${maxRetries})`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      } else {
        throw new TooManyRequestsError(response, 'Too many requests');
      }
    }

    console.error(error);
    throw new HttpError(response, 'An unknown error occurred');
  }

  throw new Error('Unreachable code');
}
