import { TranslateFunctions } from '@evaluate/translate';
import { APIEmbed } from 'discord-api-types/v10';
import { extractBoldText, extractCodeBlocks } from './discord-formatting';
import { getEmbedField } from './embed-helpers';

/**
 * Get the options from an evaluate embed.
 * @param t translate function, used to get the names of the fields
 * @param embed the embed to get the options from
 * @returns the options
 * @throws if the embed does not contain the required fields
 */
export function getEvaluateOptions(t: TranslateFunctions, embed: APIEmbed) {
  const language = extractBoldText(embed.description ?? '')[0];
  const code = extractCodeBlocks(embed.description ?? '')[0]?.code;

  if (!language || !code)
    throw new Error('Could not find language or code in embed description');

  const inputField = getEmbedField(embed, t.evaluate.input());
  const input = extractCodeBlocks(inputField?.value ?? '')[0]?.code;

  const argsField = getEmbedField(embed, t.evaluate.args());
  const args = extractCodeBlocks(argsField?.value ?? '')[0]?.code;

  const outputField = getEmbedField(embed, t.evaluate.output());
  const output = extractCodeBlocks(outputField?.value ?? '')[0]?.code;

  return { language, code, input, args, output };
}
