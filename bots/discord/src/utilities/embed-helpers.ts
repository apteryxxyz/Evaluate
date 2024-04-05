import type { APIEmbed } from 'discord-api-types/v10';

/**
 * Get the value of an embed field by name.
 * @param embed the embed to get the field from
 * @param name the name of the field
 * @returns the value of the field, or `undefined` if the field does not exist
 */
export function getEmbedField(embed: APIEmbed, name: string) {
  return embed.fields?.find((f) => f.name === name);
}
