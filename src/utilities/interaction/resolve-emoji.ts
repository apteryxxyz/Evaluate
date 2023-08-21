import type { Snowflake } from 'discord-api-types/v10';

export const UnicodeEmojis = {
  joy: '😂',
} as const;

export const CustomEmojis = {
  edit: '1137874868327682109',
  capture: '1137874864800268320',
  save: '1137874862019448892',
  run: '1137874859855204412',
  delete: '1137874856256479325',
  explain: '1139362285912064111',
} as const;

type ExtractId<T extends string> = T extends `${infer I}:a` ? I : T;
type IsAnimated<T extends string> = T extends `${string}:a` ? true : false;

/** Resolve an emoji name to its Discord representation. */
export function resolveEmoji<TName extends string>(name: TName): `:${TName}:`;

/** Resolve an custom emoji name to its Discord representation. */
export function resolveEmoji<
  TName extends keyof typeof CustomEmojis,
  TValue extends (typeof CustomEmojis)[TName],
  TId extends Snowflake = ExtractId<TValue>,
>(
  name: TName,
  returnApi?: false,
): `<${IsAnimated<TValue> extends true ? 'a' : ''}:${TName}:${TId}>`;

/** Resolve an custom emoji name to its Discord representation. */
export function resolveEmoji<
  TName extends keyof typeof CustomEmojis,
  TValue extends (typeof CustomEmojis)[TName],
  TId extends Snowflake = ExtractId<TValue>,
>(
  name: TName,
  returnApi: true,
): { id: TId; name: TName; animated: IsAnimated<TValue> };

/** Resolve an unicode emoji name to its Discord representation. */
export function resolveEmoji<
  TName extends keyof typeof UnicodeEmojis,
  TValue extends (typeof UnicodeEmojis)[TName],
>(name: TName, returnApi?: false): TValue;

/** Resolve an unicode emoji name to its Discord representation. */
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
