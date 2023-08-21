import { escapeCodeBlock } from '@discordjs/builders';

/** Extract all the double asterisk text from a string. */
export function extractBoldText(content: string) {
  return Array.from(content.match(/(\*\*)(.*?)\1/g) ?? []) //
    .map((match) => match.slice(2, -2));
}

/** Extract all the code blocks from a string. */
export function extractCodeBlocks(content: string) {
  const regex = /`{3}([\w#+]*\n)?([\S\s]*?)\n?`{3}|`([^\n`]+)`/gi;

  const codeBlocks = [];
  let match;
  while ((match = regex.exec(content))) {
    if (match[2]) {
      // Multi-line code block
      const language = match[1]?.trim() || undefined;
      const code = match[2].trim();
      codeBlocks.push({ language, code });
    } else {
      // Single-line code block
      const code = match[3];
      codeBlocks.push({ language: undefined, code });
    }
  }

  return codeBlocks;
}

/** Wrap a string inside a code block. */
export function codeBlock<TContent extends string>(
  content: TContent,
  maxLength: number,
): `\`\`\`\n${TContent}\`\`\``;

/** Wrap a string inside a code block. */
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
