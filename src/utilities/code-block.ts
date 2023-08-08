import { escapeCodeBlock } from '@discordjs/builders';

/**
 * Wrap a string inside a code block.
 * @param content The string to wrap
 * @param maxLength The maximum length of the string before it gets truncated
 */
export function codeBlock<TContent extends string>(
  content: TContent,
  maxLength: number,
): `\`\`\`\n${TContent}\`\`\``;

/**
 * Wrap a string inside a code block.
 * @param language The language to use for syntax highlighting
 * @param content The string to wrap
 * @param maxLength The maximum length of the string before it gets truncated
 */
export function codeBlock<TLanguage extends string, TContent extends string>(
  language: TLanguage,
  content: TContent,
  maxLength: number,
): `\`\`\`${TLanguage}\n${TContent}\`\`\``;

export function codeBlock(
  ...params: [string, number] | [string, string, number]
) {
  const language = typeof params[1] === 'string' ? params[0] : '';
  const content = typeof params[1] === 'string' ? params[1] : params[0];
  const maxLength = typeof params[1] === 'number' ? params[1] : params[2]!;

  return `\`\`\`${language
    .toLowerCase()
    // Bruh
    .replaceAll('#', 's')
    .replaceAll('+', 'p')}\n${
    escapeCodeBlock(
      content.length > maxLength
        ? content.slice(0, maxLength) + '...'
        : content,
    ).trim() || '‎'
  }\n\`\`\``;
}
