import { escapeCodeBlock } from 'discord.js';

/** Wrap a piece of content in a code block. */
export function codeBlock(content: string, language = '') {
    return `\`\`\`${language
        .toLowerCase()
        // Bruh
        .replaceAll('#', 's')
        .replaceAll('+', 'p')}\n${escapeCodeBlock(
        content.length > 900 ? content.slice(0, 900) + '...' : content
    )}\n\`\`\``;
}

/** Extract the contents of every code block within a piece of content. */
export function extractCodeBlocks(content: string) {
    const regex = /`{3}([\w#+]*\n)?([\S\s]*?)\n?`{3}|`([^\n`]+)`/gi;

    const codeBlocks = [];
    let match;
    while ((match = regex.exec(content))) {
        if (match[2]) {
            // Multi-line code block
            const language = match[1]?.trim() || null;
            const code = match[2].trim();
            codeBlocks.push({ language, code });
        } else {
            // Single-line code block
            const code = match[3];
            codeBlocks.push({ language: null, code });
        }
    }

    return codeBlocks;
}
