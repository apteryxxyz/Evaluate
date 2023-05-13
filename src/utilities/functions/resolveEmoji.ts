import type { APIMessageComponentEmoji, Snowflake } from 'discord.js';

export const CustomEmojis = {
    loading: 'a1105417837905981523',
    pass: '1083618759798951986',
    fail: '1083618756670005309',
} as const;

export const UnicodeEmojis = {
    joy: '😂',
} as const;

export function resolveEmoji<T extends keyof typeof CustomEmojis>(
    name: T
): `<:${T}:${Snowflake}>`;
export function resolveEmoji(name: keyof typeof UnicodeEmojis): string;
export function resolveEmoji<T extends string>(name: T): `:${T}:`;
export function resolveEmoji(name: string) {
    if (name in CustomEmojis) {
        let value = Reflect.get(CustomEmojis, name);
        const isAnimated = value.startsWith('a');
        if (isAnimated) value = value.slice(1);
        return `<${isAnimated ? 'a' : ''}:${name}:${value}>`;
    } else if (name in UnicodeEmojis) {
        return Reflect.get(UnicodeEmojis, name);
    } else return `:${name}:`;
}

export function resolveApiEmoji(
    name: keyof typeof CustomEmojis | keyof typeof UnicodeEmojis
): APIMessageComponentEmoji {
    if (name in CustomEmojis) {
        let value = Reflect.get(CustomEmojis, name);
        const isAnimated = value.startsWith('a');
        if (isAnimated) value = value.slice(1);
        return { id: value, name, animated: isAnimated };
    } else if (name in UnicodeEmojis) {
        const value = Reflect.get(UnicodeEmojis, name);
        return { name: value };
    }

    return { name };
}
