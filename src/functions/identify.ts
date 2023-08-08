import { bold, EmbedBuilder } from '@discordjs/builders';
import type { APIInteraction } from 'discord-api-types/v10';
import { api } from '@/core';
import { codeBlock } from '@/utilities/code-block';
import type { TranslationFunctions } from '.translations';

export async function handleIdentifing(
  t: TranslationFunctions,
  interaction: APIInteraction,
  options: { code: string },
) {
  await api.interactions.defer(interaction.id, interaction.token);

  const { detectLanguage } = await import('@/services/detection');
  const result = await detectLanguage({ code: options.code });

  const embed = new EmbedBuilder()
    .setTitle(t.identify.result.title())
    .setColor(result ? 0x2fc086 : 0xff0000)
    .setDescription(codeBlock(result ?? '', options.code, 4000))
    .addFields({
      name: t.identify.prediction.name(),
      value: result
        ? t.identify.prediction.identified({ language: bold(result) })
        : t.identify.prediction.unknown(),
    });

  return void (await api.interactions.editReply(
    interaction.application_id,
    interaction.token,
    { embeds: [embed.toJSON()] },
  ));
}
