import type { Snowflake } from 'discord-api-types/v10';

export const UnicodeEmojis = {
  joy: '😂',
} as const;

export const CustomEmojis = {
  pencil: '1137874868327682109',
  camera: '1137874864800268320',
  play: '1137874859855204412',
  bin: '1137874856256479325',
  comment: '1139362285912064111',
  link: '1205156612839309332',
  globe: '1205168470640296036',
} as const;

type ExtractId<T extends string> = T extends `${infer I}:a` ? I : T;
type IsAnimated<T extends string> = T extends `${string}:a` ? true : false;

/**
 * Resolve a string to an emoji
 * @param name the name of the emoji
 * @returns the emoji
 */
export function resolveEmoji<TName extends string>(name: TName): `:${TName}:`;

/**
 * Resolve a string to a custom emoji
 * @param name the name of the emoji
 * @param returnApi whether to return the api representation of the emoji
 * @returns the emoji
 */
export function resolveEmoji<
  TName extends keyof typeof CustomEmojis,
  TValue extends (typeof CustomEmojis)[TName],
  TId extends Snowflake = ExtractId<TValue>,
>(
  name: TName,
  returnApi?: false,
): `<${IsAnimated<TValue> extends true ? 'a' : ''}:${TName}:${TId}>`;

/**
 * Resolve a string to a custom emoji
 * @param name the name of the emoji
 * @param returnApi whether to return the api representation of the emoji
 * @returns the emoji
 */
export function resolveEmoji<
  TName extends keyof typeof CustomEmojis,
  TValue extends (typeof CustomEmojis)[TName],
  TId extends Snowflake = ExtractId<TValue>,
>(
  name: TName,
  returnApi: true,
): { id: TId; name: TName; animated: IsAnimated<TValue> };

/**
 * Resolve a string to a unicode emoji
 * @param name the name of the emoji
 * @param returnApi whether to return the api representation of the emoji
 * @returns the emoji
 */
export function resolveEmoji<
  TName extends keyof typeof UnicodeEmojis,
  TValue extends (typeof UnicodeEmojis)[TName],
>(name: TName, returnApi?: false): TValue;

/**
 * Resolve a string to a unicode emoji
 * @param name the name of the emoji
 * @param returnApi whether to return the api representation of the emoji
 * @returns the emoji
 */
export function resolveEmoji<
  TName extends keyof typeof UnicodeEmojis,
  TValue extends (typeof UnicodeEmojis)[TName],
>(name: TName, returnApi: true): { name: TValue };

export function resolveEmoji(name: string, returnApi = false) {
  if (isUnicodeEmoji(name)) {
    const value = UnicodeEmojis[name];
    if (returnApi) return { name: value };
    return value;
  }

  if (isCustomEmoji(name)) {
    const [id, suffix] = CustomEmojis[name].split(':');
    if (returnApi) return { id, name, animated: suffix === 'a' };
    return `<${suffix ?? ''}:${name}:${id}>`;
  }

  return `:${name}:`;
}

function isUnicodeEmoji(name: string): name is keyof typeof UnicodeEmojis {
  return name in UnicodeEmojis;
}

function isCustomEmoji(name: string): name is keyof typeof CustomEmojis {
  return name in CustomEmojis;
}
