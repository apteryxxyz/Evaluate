import { EmbedBuilder } from '@discordjs/builders';
import type { APIInteraction } from '@discordjs/core';
import type { TranslationFunctions } from 'translations';
import { api } from '@/core';
import { determineLocale } from '@/translate/functions';

export async function handleExplaining(
  t: TranslationFunctions,
  interaction: APIInteraction,
  options: { language: string; code: string; output: string },
) {
  await api.interactions.defer(interaction.id, interaction.token);

  const { explainError } = await import('@/services/assistant');
  const locale = determineLocale(interaction);
  const result = await explainError({ ...options, locale });

  const embed = new EmbedBuilder()
    .setTitle(t.evaluate.explain.title())
    .setDescription(result)
    .setColor(0x2fc086);

  return void (await api.interactions.editReply(
    interaction.application_id,
    interaction.token,
    { embeds: [embed.toJSON()] },
  ));
}
