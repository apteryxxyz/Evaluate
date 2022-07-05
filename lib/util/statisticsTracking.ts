import { Statistics } from '@lib/models/Statistics';
import type { Snowflake } from 'discord.js';

export async function getOrCreate(userId: Snowflake) {
    const statistics = await Statistics.findOne({ userId });
    if (statistics) return statistics;
    return Statistics.create({ userId });
}

export async function addLanguage(userId: Snowflake, language: string) {
    const statistics = await getOrCreate(userId);
    statistics.usedLanguages.push(language);
    statistics.firstUsedAt = new Date();
    return statistics.save();
}

export async function incrementCommandCount(userId: Snowflake) {
    const statistics = await getOrCreate(userId);
    statistics.commandCount++;
    statistics.lastUsedAt = new Date();
    return statistics.save();
}

export async function getTotals() {
    const totals = await Statistics.aggregate<{ count: number; languages: any[] }>([
        {
            $group: {
                _id: null,
                count: { $sum: '$commandCount' },
                languages: { $addToSet: '$usedLanguages' },
            },
        },
    ]);
    if (!totals[0]) return { commandCount: 0, mostUsedLanguage: 'N/A' };
    const mostUsedLanguage = totals[0].languages
        ?.flat()
        .reduce((a, b) => (a.length > b.length ? a : b), 'N/A');
    return { commandCount: totals[0].count || 0, mostUsedLanguage };
}

export async function mostPopularLanguages(): Promise<string[]> {
    const totals = await Statistics.aggregate<{ languages: any[][] }>([
        {
            $group: {
                _id: null,
                languages: { $addToSet: '$usedLanguages' },
            },
        },
    ]);

    if (!totals[0]) return [];
    const languages = totals[0].languages.flat();
    const counts = languages.reduce((acc, cur) => {
        acc[cur] = (acc[cur] || 0) + 1;
        return acc;
    }, {});
    const sorted = Object.entries<number>(counts).sort((a, b) => b[1] - a[1]);
    return sorted.map(([language]) => language);
}
