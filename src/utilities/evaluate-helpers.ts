import type { APIEmbed } from 'discord-api-types/v10';
import type { TranslationFunctions } from 'translations';
import { extractBoldText, extractCodeBlocks } from './discord-formatting';
import { getEmbedField } from './embed-helpers';

export function getEvaluateOptions(t: TranslationFunctions, embed: APIEmbed) {
  const language = extractBoldText(embed.description!).at(0)!;
  const code = extractCodeBlocks(embed.description!).at(0)!.code;
  const input = extractCodeBlocks(
    getEmbedField(embed, t.evaluate.input.name())?.value ?? '',
  )?.at(0)?.code;
  const args = extractCodeBlocks(
    getEmbedField(embed, t.evaluate.args.name())?.value ?? '',
  )?.at(0)?.code;
  const output = getEmbedField(embed, t.evaluate.output.name())!.value;
  return { language, code, input, args, output };
}
