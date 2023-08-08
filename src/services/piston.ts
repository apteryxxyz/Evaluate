import Fuse from 'fuse.js';
import { Lexer, longShortStrategy, Parser } from 'lexure';
import {
  formatLanguageName,
  formatRuntimeName,
} from '@/utilities/format-names';

export function fetchLanguages() {
  return fetch('https://emkc.org/api/v2/piston/runtimes') //
    .then((response) => response.json() as Promise<PistonRuntime[]>)
    .then((runtimes) =>
      runtimes.map(({ runtime, ...data }) => {
        const languageName = formatLanguageName(data.language);
        const runtimeName = runtime && formatRuntimeName(runtime);

        return {
          id: `${data.language}${runtime ? `///${runtime}` : ''}`,
          key: data.language,
          name: `${languageName}${runtimeName ? ` (${runtimeName})` : ''}`,
          aliases: data.aliases,
          version: data.version,
          runtime: runtime && {
            id: runtime,
            key: runtime,
            name: runtimeName,
          },
        } as Language;
      }),
    );
}

export async function searchLanguages(query: string) {
  if (query.length === 0) return [];

  const languages = await fetchLanguages();
  const keys = ['id', 'name', 'aliases', 'runtime.id', 'runtime.name'];
  const fuse = new Fuse(languages, { keys, threshold: 0.3 });
  return fuse.search(query).map(({ item }) => item);
}

const PREFERRED_RUNTIMES = new Map([
  ['javascript', 'node'],
  ['typescript', undefined],
]);

export async function findLanguage(resolvable: string) {
  resolvable = resolvable.toLowerCase().trim();
  if (resolvable === '') return undefined;

  const languages = await fetchLanguages();
  return languages.find((language) => {
    const wasFound = [
      language.id,
      language.key,
      language.name,
      ...language.aliases,
    ].some((value) => value.toLowerCase() === resolvable);

    if (!wasFound) return false;
    if (resolvable !== language.key) return wasFound;

    // By default "javascript" will return "deno" but we prefer "node"
    const runtime = PREFERRED_RUNTIMES.get(language.key);
    return runtime === language.runtime?.key;
  });
}

export async function executeCode(options: ExecuteCodeOptions) {
  const result = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: options.language.id.split('///')[0],
      version: options.language.version,
      files: [{ content: options.code }],
      stdin: options.input,
      args: options.args ? parseArguments(options.args) : undefined,
    }),
  }).then((response) => response.json() as Promise<PistonExecuteResult>);

  return {
    ...options,
    success: result.run.code === 0,
    output: (result.run.output ?? '').replaceAll('/piston/', '/evaluate/'),
  };
}

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

export interface PistonRuntime {
  language: string;
  version: string;
  aliases: string[];
  runtime?: string;
}

export interface Language {
  id: string;
  key: string;
  name: string;
  version: string;
  aliases: string[];
  runtime?: {
    id: string;
    key: string;
    name: string;
  };
}

export interface PistonExecuteResult {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
  };
  compile?: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
  };
}

export interface ExecuteCodeOptions {
  language: Language;
  code: string;
  input?: string;
  args?: string;
}

export interface ExecuteCodeResult extends ExecuteCodeOptions {
  success: boolean;
  output: string;
}
