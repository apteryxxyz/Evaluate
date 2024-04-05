import * as fs from 'node:fs';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { expand as dotenvExpand } from 'dotenv-expand';

/**
 * Load and return the environment variables from the environment files.
 * @returns the environment variables
 */
export function loadEnv() {
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
