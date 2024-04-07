import type { APIEmbed } from 'discord-api-types/v10';
import { extractBoldText, extractCodeBlocks } from './discord-formatting';
import { getEmbedField } from './embed-helpers';

/**
 * Get the options from an evaluate embed.
 * @param t translate function, used to get the names of the fields
 * @param embed the embed to get the options from
 * @returns the options
 * @throws if the embed does not contain the required fields
 */
export function getEvaluateOptions(embed: APIEmbed) {
  const runtime = extractBoldText(embed.description ?? '')[0];
  const code = extractCodeBlocks(embed.description ?? '')[0]?.code;

  if (!runtime || !code)
    throw new Error('Could not find runtime or code in embed description');

  const inputField = getEmbedField(embed, 'STD Input');
  const input = extractCodeBlocks(inputField?.value ?? '')[0]?.code;

  const argsField = getEmbedField(embed, 'CLI Arguments');
  const args = extractCodeBlocks(argsField?.value ?? '')[0]?.code;

  const outputField = getEmbedField(embed, 'Output');
  const output = extractCodeBlocks(outputField?.value ?? '')[0]?.code;

  return { runtime: runtime, code, input, args, output };
}
