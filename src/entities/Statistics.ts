import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Base, createRepository } from './Base';
import type { Executor } from '&services/Executor';

@Entity()
export class Statistics extends Base {
    @PrimaryColumn()
    public id!: string;

    @Column('simple-array')
    public usedLanguages: string[] = [''];

    @Column()
    public commandCount: number = 0;

    @Column()
    public evaluatorCount: number = 0;

    @Column()
    public captureCount: number = 0;

    public static repository = createRepository({
        __type: () => new Statistics(),

        async ensureStatistics(userId: string) {
            const existing = await this.findOneBy({ id: userId });
            if (existing) return existing;

            const statistics = new Statistics();
            statistics.id = userId;

            return statistics;
        },

        async appendLanguage(userId: string, language: Executor.Language) {
            const statistics = await this.ensureStatistics(userId);
            statistics.usedLanguages.push(language.key);
            await this.save(statistics);
        },

        async incrementCommandCount(userId: string) {
            const statistics = await this.ensureStatistics(userId);
            statistics.commandCount++;
            await this.save(statistics);
        },

        async incrementEvaluatorCount(userId: string) {
            const statistics = await this.ensureStatistics(userId);
            statistics.evaluatorCount++;
            await this.save(statistics);
        },

        async incrementCaptureCount(userId: string) {
            const statistics = await this.ensureStatistics(userId);
            statistics.captureCount++;
            await this.save(statistics);
        },

        async getTotals() {
            const statistics = await this.find();
            const totals = {
                usedLanguages: [] as string[],
                commandCount: 0,
                evaluatorCount: 0,
                captureCount: 0,
            };

            for (const stat of statistics) {
                totals.usedLanguages.push(...stat.usedLanguages);
                totals.commandCount += stat.commandCount;
                totals.evaluatorCount += stat.evaluatorCount;
                totals.captureCount += stat.captureCount;
            }

            const mostUsedLanguage = findMostCommon(totals.usedLanguages);
            return { ...totals, mostUsedLanguage };
        },

        async getMostUsedLanguages() {
            const statistics = await this.find();
            const languages = statistics.flatMap(stat => stat.usedLanguages);

            const counts = languages.reduce((map, language) => {
                const count = map.get(language) ?? 0;
                map.set(language, count + 1);
                return map;
            }, new Map<string, number>());

            const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
            return sorted.map(([language]) => language).slice(0, 5);
        },
    });
}

function findMostCommon<T>(array: T[]) {
    const map = new Map<T, number>();

    for (const item of array) {
        const count = map.get(item) ?? 0;
        map.set(item, count + 1);
    }

    let max = 0;
    let mostCommon = null;
    for (const [item, count] of map.entries()) {
        if (count > max) {
            max = count;
            mostCommon = item;
        }
    }

    return mostCommon;
}
