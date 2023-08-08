import type { APIEmbed } from 'discord-api-types/v10';

export function getBolds(text: string) {
  return Array.from(text.match(/(\*\*)(.*?)\1/g) ?? []) //
    .map((match) => match.slice(2, -2));
}

export function getCodeBlocks(content: string) {
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

export function getEmbedField(embed: APIEmbed, name: string) {
  return embed.fields?.find((field) => field.name === name);
}
