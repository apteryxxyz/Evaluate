import * as fs from 'node:fs';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { expand as dotenvExpand } from 'dotenv-expand';

/**
 * Load the environment variables from the environment files into the process.
 * @returns process.{@link process.env env}
 */
export function loadEnv() {
  insertVariables(readEnv());
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
      if (value !== undefined) variables[key] = value;
  }

  return expandVariables(variables);
}

/**
 * Insert the variables into the process environment.
 * @param variables the variables to insert
 */
export function insertVariables(variables: Record<string, string>) {
  for (const [key, value] of Object.entries(variables))
    process.env[key] ??= value;
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
  return dotenv.parse(content);
}

function expandVariables(parsed: Record<string, string>) {
  return dotenvExpand({ parsed, processEnv: parsed }).parsed ?? {};
}
