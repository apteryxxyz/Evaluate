import type { APIEmbed } from 'discord-api-types/v10';
import type { TranslationFunctions } from 'translations';

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

export function getEvaluateOptions(t: TranslationFunctions, embed: APIEmbed) {
  const language = getBolds(embed.description!).at(0)!;
  const code = getCodeBlocks(embed.description!).at(0)!.code;
  const input = getCodeBlocks(
    getEmbedField(embed, t.evaluate.input.name())?.value ?? '',
  )?.at(0)?.code;
  const args = getCodeBlocks(
    getEmbedField(embed, t.evaluate.args.name())?.value ?? '',
  )?.at(0)?.code;
  const output = getEmbedField(embed, t.evaluate.output.name())!.value;
  return { language, code, input, args, output };
}
