/**
 * Extract all the double asterisk text from a string.
 * @param content the string to extract bold text from
 * @returns an array of bold text
 */
export function extractBoldText(content: string) {
  return Array.from(content.match(/(\*\*)(.*?)\1/g) ?? []) //
    .map((match) => match.slice(2, -2));
}

/**
 * Extracts code blocks from a string.
 * @param content the string to extract code blocks from
 * @returns an array of code blocks
 */
export function extractCodeBlocks(content: string) {
  const regex = /`{3}([\w#+]*\n)?([\S\s]*?)\n?`{3}|`([^\n`]+)`/gi;

  const codeBlocks = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content))) {
    if (match[2]) {
      // Multi-line code block
      const runtime = match[1]?.trim() || undefined;
      const code = match[2].trim();
      codeBlocks.push({ runtime, code });
    } else {
      // Single-line code block
      const code = match[3];
      codeBlocks.push({ runtime: undefined, code });
    }
  }

  return codeBlocks;
}

/**
 * Escapes code blocks in a string.
 * @param content the string to escape code blocks in
 * @returns the escaped string
 */
export function escapeCodeBlock(content: string) {
  return content.replace(/(```)/g, '`\u200b``').replace(/(`)/g, '`\u200b');
}

/**
 * Formats a string as a code block.
 * @param content the string to format
 * @param maxLength the maximum length of the string
 * @returns the formatted string
 */
export function codeBlock<T extends string>(
  content: T,
  maxLength: number,
): `\`\`\`\n${T}\`\`\``;

/**
 * Formats a string as a code block.
 * @param runtime the runtime of the code block.
 * @param content the string to format
 * @param maxLength the maximum length of the string
 * @returns the formatted string
 */
export function codeBlock<T extends string, U extends string>(
  runtime: T,
  content: U,
  maxLength: number,
): `\`\`\`${T}\n${U}\`\`\``;

export function codeBlock(
  ...params: [string, number] | [string, string, number]
) {
  const runtime = typeof params[1] === 'string' ? params[0] : '';
  const content = typeof params[1] === 'string' ? params[1] : params[0];
  const maxLength = typeof params[1] === 'number' ? params[1] : params[2]!;

  return `\`\`\`${runtime
    .toLowerCase()
    // Bruv
    .replaceAll('#', 's')
    .replaceAll('+', 'p')}\n${
    escapeCodeBlock(
      content.length > maxLength
        ? `${content.slice(0, maxLength)}...`
        : content,
    ).trim() || '‎'
  }\n\`\`\``;
}
