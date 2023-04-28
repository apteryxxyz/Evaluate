import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

void main();
async function main() {
    const pathToEnv = resolve('.env.schema');
    const pathToOut = resolve('src/env.ts');

    const envSchemaExists = existsSync(pathToEnv);
    if (!envSchemaExists)
        throw new Error(`No .env.schema file found at ${pathToEnv}`);

    const envContent = await readFile(pathToEnv, 'utf8');
    if (!envContent)
        throw new Error(`.env.schema file at ${pathToEnv} is empty`);

    const envVars = envContent.split('\n').filter(Boolean).map(parseLine);
    const fileContent = buildFileContent(envVars);
    await writeFile(pathToOut, fileContent, 'utf8');
}

function parseLine(line: string): [string, string] {
    const [key, value] = line.split('=');
    // eslint-disable-next-line prefer-const
    let [name, type] = key.split(':');
    let zod = parseType(type);

    const isOptional = name.endsWith('?');
    if (isOptional) {
        name = name.slice(0, -1);
        zod += '.optional()';
    }

    const hasDefault = value !== undefined;
    if (hasDefault) zod += `.default(${wrapInQuotes(value)})`;

    return [name.toUpperCase(), zod];
}

function parseType(value: string): string {
    const isString = !value || value === 'string' || /^(|''|"")$/.test(value);
    if (isString) return `z.string()`;

    const isRegex = value.startsWith('/') && value.endsWith('/');
    if (isRegex) return `z.string().regex(${value})`;

    const isUnion = value.includes('|');
    if (isUnion) {
        const types = value.split('|').map(parseType);
        return `z.union([${types.join(', ')}])`;
    }

    return `z.literal(${wrapInQuotes(value)})`;
}

function wrapInQuotes(value: string) {
    const quote = value.includes("'") ? '"' : "'";
    return `${quote}${value}${quote}`;
}

function buildFileContent(envVars: [string, string][]) {
    return `
/* eslint-disable n/prefer-global/process */
/* eslint-disable no-restricted-globals */

import 'dotenv-flow/config';
import { z } from 'zod';

export const envSchema = z.object({
${envVars.map(([name, zod]) => `    ${name}: ${zod}`).join(',\n')}
});

export type Env = z.infer<typeof envSchema>;

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Env {}
    }
}

export const env = envSchema.parse(process.env);
process.env = Object.assign(process.env, env);
    `.trim();
}
