import fetch from '@evaluate/fetch';
import {
  decodeRuntimeId,
  getRuntimeDefaultFileName,
  type Runtime,
} from '@evaluate/runtimes';
import { parseArguments } from './arguments.js';
import {
  type CodeOptions,
  ExecuteOptions,
  ExecuteResult,
  type FilesOptions,
} from './shapes.js';

export async function executeCode(
  runtime: Runtime,
  options: CodeOptions | FilesOptions,
) {
  const [language] = decodeRuntimeId(runtime.id)!;
  const executeOptions = ExecuteOptions.from(options);

  if ('file.code' in executeOptions.files) {
    const name = getRuntimeDefaultFileName(runtime.id) ?? 'file.code';
    if (name) {
      executeOptions.files[name] = executeOptions.files['file.code'];
      delete executeOptions.files['file.code'];
      executeOptions.entry = executeOptions.entry || name;
    }
  }

  console.trace(
    'executeCode',
    { executeOptions },
    Boolean(executeOptions.files['::args::']),
    parseArguments(executeOptions.files['::args::']!),
  );

  const body = {
    language,
    version: runtime.version,
    files: Object.entries(executeOptions.files)
      .filter(([name]) => !name.startsWith('::'))
      .map(([n, c]) => ({ name: n, content: c }))
      .sort((a) => (executeOptions.entry === a.name ? -1 : 1)),
    stdin: executeOptions.files['::input::'],
    args: executeOptions.files['::args::']
      ? parseArguments(executeOptions.files['::args::'])
      : undefined,
  };

  console.log('executeCode', { body });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const response = await fetch('https://emkc.org/api/v2/piston/execute', {
    signal: controller.signal,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).finally(() => clearTimeout(timeout));
  const json = await response.json();

  try {
    const executeResult = ExecuteResult.parse(json);
    return [executeResult, executeOptions] as const;
  } catch (error) {
    console.error('Error parsing incoming json', error, json);
    throw new Error('An error occurred while executing the code', {
      cause: error,
    });
  }
}
