import { bold, EmbedBuilder } from '@discordjs/builders';
import type { APIInteraction } from 'discord-api-types/v10';
import { api } from '@/core';
import { identifyCode } from '@/services/assistant';
import { codeBlock } from '@/utilities/interaction/discord-formatting';
import type { TranslationFunctions } from '.translations';

export async function handleIdentifing(
  t: TranslationFunctions,
  interaction: APIInteraction,
  options: { code: string[]; ephemeral?: boolean },
) {
  await api.interactions.defer(interaction.id, interaction.token, {
    flags: options.ephemeral ? 64 : undefined,
  });

  const promises = options.code.map((code) => {
    if (code.length < 4) return Promise.resolve(null);
    return identifyCode({ code });
  });
  const results = await Promise.all(promises);

  const embeds = results.map((result, index) => {
    const [key, name] =
      typeof result === 'string'
        ? [result, result]
        : [result?.key, result?.name];

    const embed = new EmbedBuilder()
      .setColor(result ? 0x2fc086 : 0xff0000)
      .addFields({
        name: t.identify.prediction(),
        value: name
          ? t.identify.prediction.identified_as({ language_name: bold(name) })
          : t.identify.prediction.could_not_identify(),
      });

    if (index === 0) embed.setTitle(t.identify());
    if (options.code[index].length)
      embed.setDescription(codeBlock(key ?? '', options.code[index], 4000));
    return embed;
  });

  return void (await api.interactions.editReply(
    interaction.application_id,
    interaction.token,
    { embeds: embeds.map((e) => e.toJSON()) },
  ));
}
