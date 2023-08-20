import { EmbedBuilder } from '@discordjs/builders';
import type { APIInteraction } from 'discord-api-types/v10';
import type { TranslationFunctions } from 'translations';
import { api } from '@/core';
import { explainError } from '@/services/assistant';
import { determineLocale } from '@/translations/determine-locale';

export async function handleExplaining(
  t: TranslationFunctions,
  interaction: APIInteraction,
  options: { language: string; code: string; output: string },
) {
  await api.interactions.defer(interaction.id, interaction.token);

  const locale = determineLocale(interaction);
  const result = await explainError({ ...options, locale });

  const embed = new EmbedBuilder()
    .setTitle(t.explain.title())
    .setDescription(result ?? t.explain.internal_error())
    .setColor(0x2fc086);

  return void (await api.interactions.editReply(
    interaction.application_id,
    interaction.token,
    { embeds: [embed.toJSON()] },
  ));
}
