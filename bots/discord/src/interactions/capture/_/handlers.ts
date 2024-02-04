import { generateCodeImage } from '@evaluate/capture';
import { APIInteraction } from 'discord-api-types/v10';
import { analytics, api } from '~/core';
import { getUser } from '~/utilities/interaction-helpers';

/**
 * Handle the capturing of code.
 * @param t the translate functions to handle localisation
 * @param interaction the interaction this is in response to
 * @param code the code to capture
 */
export async function handleCapturing(
  interaction: APIInteraction,
  code: string,
) {
  await api.interactions.defer(interaction.id, interaction.token);

  const imageBuffer = await generateCodeImage(code) //
    .catch(() => null);

  void analytics?.capture({
    distinctId: getUser(interaction)?.id!,
    event: 'capture created',
    properties: {
      platform: 'discord bot',
      'guild id': interaction.guild_id,
      'channel id': interaction.channel?.id,

      'code length': code.length,
      'was successful': Boolean(imageBuffer),
    },
  });

  // just let discord handle the error
  if (!imageBuffer) return;

  return api.interactions.editReply(
    interaction.application_id,
    interaction.token,
    {
      files: [
        {
          contentType: 'image/png',
          name: 'evaluate.png',
          data: Buffer.from(imageBuffer),
        },
      ],
    },
  );
}
