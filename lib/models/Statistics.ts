import type { Snowflake } from 'discord.js';
import { HydratedDocument, model, Schema } from 'mongoose';

export interface IStatistics {
    userId: Snowflake;
    usedLanguages: string[];
    commandCount: number;
    firstUsedAt: Date;
    lastUsedAt: Date;

    favouriteLanguage: () => string;
}

export type HStatistics = HydratedDocument<IStatistics>;

const statisticsSchema = new Schema<IStatistics>({
    userId: { type: String, required: true, unique: true },
    usedLanguages: { type: [String], default: [] },
    commandCount: { type: Number, default: 0 },
    firstUsedAt: { type: Date, default: Date.now },
    lastUsedAt: { type: Date, default: Date.now },
});

statisticsSchema.methods.favouriteLanguage = function favouriteLanguage() {
    const languages = (this as HStatistics).usedLanguages;
    if (!languages.length) return '';
    const counts = languages.map((l) => languages.filter((l2) => l === l2).length);
    const max = Math.max(...counts);
    const index = counts.indexOf(max);
    return languages[index];
};

export const Statistics = model('Statistics', statisticsSchema);
