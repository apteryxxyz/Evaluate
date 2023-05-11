import type { AnyComponentBuilder } from '@discordjs/builders';
import { ActionRowBuilder } from '@discordjs/builders';

/** Easily wrap any number of components in an action row. */
export function wrapInRow<T extends AnyComponentBuilder>(...components: T[]) {
    return new ActionRowBuilder<T>().addComponents(...components);
}

/** Build a field, returning undefined if value is empty. */
export function buildField(name: string, value: unknown, inline = false) {
    const string = String(value ?? '');
    if (!string || value === '```\n\n```') return undefined as never;
    return { name, value: string, inline };
}

/** Remove any nullish values from a list. */
export function removeNullish<T>(...values: (T | undefined | null)[]): T[] {
    return values.filter(
        (value): value is T => value !== null && value !== undefined
    );
}

/** Build a list of fields, removing any nullish. */
export function buildFields(...fields: Parameters<typeof buildField>[]) {
    return removeNullish(...fields.map(params => buildField(...params)));
}

/** Allow use of 'new' keyword with regular functions, needed to make TypeScript happy. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type New<T extends (...args: any[]) => any> = new (
    ...args: Parameters<T>
) => ReturnType<T>;
