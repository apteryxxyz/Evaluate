import type { APIEmbed } from 'discord-api-types/v10';

export function getEmbedField(embed: APIEmbed, name: string) {
  return embed.fields?.find((field) => field.name === name);
}
