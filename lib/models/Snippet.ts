import type { Snowflake } from 'discord.js';
import { Schema, HydratedDocument, model } from 'mongoose';
import type { Options } from '@structures/Provider';

export interface Owner {
    id: Snowflake;
    name: string;
    addedAt: Date;
}

export interface ISnippet {
    providerId: string;
    createdAt: Date;
    owners: Owner[];
    options: Partial<Omit<Omit<Options, 'language'>, 'code'>> & { language: string; code: string };
}

export type HSnippet = HydratedDocument<ISnippet>;

const snippetSchema = new Schema<ISnippet>({
    providerId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    options: {
        language: { type: String, required: true },
        code: { type: String, required: true },
        input: { type: String, default: undefined },
        args: { type: [String], default: [] },
    },
    owners: [
        {
            id: { type: String, required: true },
            name: { type: String, required: true },
            addedAt: { type: Date, required: true },
        },
    ],
});

export const Snippet = model('Snippet', snippetSchema);
