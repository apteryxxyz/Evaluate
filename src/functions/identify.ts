import { bold, EmbedBuilder } from '@discordjs/builders';
import type { APIInteraction } from 'discord-api-types/v10';
import { api } from '@/core';
import { codeBlock } from '@/utilities/code-block';
import type { TranslationFunctions } from '.translations';

export async function handleIdentifing(
  t: TranslationFunctions,
  interaction: APIInteraction,
  options: { code: string[]; ephemeral?: boolean },
) {
  await api.interactions.defer(interaction.id, interaction.token, {
    flags: options.ephemeral ? 64 : undefined,
  });

  const { detectLanguage } = await import('@/services/assistant');

  const promises = options.code.map((code) => detectLanguage({ code }));
  const results = await Promise.all(promises);

  const embeds = results.map((result, index) => {
    const embed = new EmbedBuilder()
      .setColor(result ? 0x2fc086 : 0xff0000)
      .setDescription(codeBlock(result ?? '', options.code[index], 4000))
      .addFields({
        name: t.identify.prediction.name(),
        value: result
          ? t.identify.prediction.identified({ language: bold(result) })
          : t.identify.prediction.unknown(),
      });

    if (index === 0) return embed.setTitle(t.identify.result.title());
    return embed;
  });

  return void (await api.interactions.editReply(
    interaction.application_id,
    interaction.token,
    { embeds: embeds.map((e) => e.toJSON()) },
  ));
}
