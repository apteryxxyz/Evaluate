import type { Embed } from '@buape/carbon';
import { extractBoldText, extractCodeBlocks } from './discord-formatting';
import { getEmbedField } from './embed-helpers';
import { resolveEmoji } from './resolve-emoji.js';

/**
 * Get the options from an evaluate embed.
 * @param embed the embed to get the options from
 * @returns the options
 * @throws if the embed does not contain the required fields
 */
export function getEvaluateOptions(embed: Embed) {
  const runtime = extractBoldText(embed.description ?? '')[0];
  const code = extractCodeBlocks(embed.description ?? '')[0]?.code;

  if (!runtime || !code)
    throw new Error('Could not find runtime or code in embed description');

  const inputField = getEmbedField(embed, resolveEmoji('keyboard'));
  const input = extractCodeBlocks(inputField?.value ?? '')[0]?.code;

  const argsField = getEmbedField(embed, resolveEmoji('puzzle'));
  const args = extractCodeBlocks(argsField?.value ?? '')[0]?.code;

  const outputField = getEmbedField(embed, resolveEmoji('printer'));
  const output = extractCodeBlocks(outputField?.value ?? '')[0]?.code;

  return { runtime, code, input, args, output };
}
