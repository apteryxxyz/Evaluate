import * as fs from 'node:fs';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { expand as dotenvExpand } from 'dotenv-expand';

/**
 * Load the environment variables from the environment files into the process.
 * @returns process.{@link process.env env}
 */
export function loadEnv() {
  const variables = readEnv();
  for (const [key, value] of Object.entries(variables))
    process.env[key] ??= value;
  return process.env;
}

/**
 * Read the environment variables from the environment files.
 * @returns the environment variables
 */
export function readEnv() {
  const variables: Record<string, string> = {};
  const root = process.env.ORIGINAL_DIR ?? '.';

  for (const file of getListOfEnvFiles().reverse()) {
    const location = path.join(root, file);
    if (!fs.existsSync(location)) continue;

    const contents = fs.readFileSync(location, 'utf8');
    const parsed = extractVariablesFromContents(contents);
    for (const [key, value] of Object.entries(parsed ?? {}))
      if (value !== undefined) process.env[key] = value;
  }

  return variables;
}

/**
 * Get a list of the environment files to look for, in order of priority.
 * @returns the list of environment files
 */
function getListOfEnvFiles() {
  const mode = process.env.NODE_ENV || 'development';
  return [`.env.${mode}.local`, '.env.local', `.env.${mode}`, '.env'];
}

/**
 * Extract the variables from a string.
 * @param content the content to extract the variables from
 * @returns the extracted variables
 */
function extractVariablesFromContents(content: string) {
  const parsed = dotenv.parse(content);
  const expanded = dotenvExpand({ parsed, processEnv: {} });
  return expanded.parsed as Record<string, string>;
}
