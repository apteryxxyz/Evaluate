import type { Language } from '@lib/structures/Provider';
import { escapeCodeBlock } from 'discord.js';

/**
 * Place backticks around a string to make it a code block
 * @param input The input
 * @param language Language prefix for colour
 */
export function codeBlock(input: string, language = '') {
    return `\`\`\`${language}\n${escapeCodeBlock(input)}\n\`\`\``;
}

/**
 * Extract the code from a code block
 * @param content The content to extract the code from
 */
export function extractCodeBlock(content: string): { language: string; code: string } {
    const regex = /[`]{3}(\w+\n)?([\S\s]+)[`]{3}/i;
    const matches = content.match(regex);
    const language = matches?.[1]?.trim() || '';
    const code = matches?.[2]?.trim() || '';
    return { language, code };
}

/**
 * Format a language into a string containing name, runtime and version
 * @param language The language to get the formatted name for
 */
export function formatLanguageName(language: Language) {
    return `${language.name} (${language.runtime ? `${language.runtime.name}, ` : ''}${
        language.version
    })`;
}
