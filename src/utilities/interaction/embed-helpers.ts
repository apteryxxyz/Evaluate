import type { APIEmbed } from 'discord-api-types/v10';

/**
 * Get the value of an embed field by name.
 * @param embed The embed to get the field from
 * @param name The name of the field
 */
export function getEmbedField(embed: APIEmbed, name: string) {
  return embed.fields?.find((field) => field.name === name);
}
