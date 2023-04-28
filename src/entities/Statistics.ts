import {
    Entity,
    EntityRepository,
    EntityRepositoryType,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import type { Executor } from '&services/Executor';

@Entity({ customRepository: () => StatisticsRepository })
export class Statistics {
    public [EntityRepositoryType]?: StatisticsRepository;

    @PrimaryKey()
    public id!: string;

    @Property()
    public usedLanguages: string[] = [];

    @Property()
    public commandCount: number = 0;

    @Property()
    public evaluatorCount: number = 0;

    @Property()
    public captureCount: number = 0;

    @Property()
    public createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    public updatedAt: Date = new Date();
}

export class StatisticsRepository extends EntityRepository<Statistics> {
    public async ensureStatistics(id: string) {
        const existing = await this.findOne({ id });
        if (existing) return existing;

        const statistics = new Statistics();
        statistics.id = id;
        this.getEntityManager().persist(statistics);

        return statistics;
    }

    public async appendLanguage(id: string, language: Executor.Language) {
        const statistics = await this.ensureStatistics(id);
        statistics.usedLanguages.push(language.key);
        await this.getEntityManager().persistAndFlush(statistics);
    }

    public async incrementCommandCount(id: string) {
        const statistics = await this.ensureStatistics(id);
        statistics.commandCount++;
        await this.getEntityManager().persistAndFlush(statistics);
    }

    public async incrementEvaluatorCount(id: string) {
        const statistics = await this.ensureStatistics(id);
        statistics.evaluatorCount++;
        await this.getEntityManager().persistAndFlush(statistics);
    }

    public async incrementCaptureCount(id: string) {
        const statistics = await this.ensureStatistics(id);
        statistics.captureCount++;
        await this.getEntityManager().persistAndFlush(statistics);
    }

    public async getTotals() {
        const statistics = await this.findAll();
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
    }

    public async getFavouriteLanguage(id: string) {
        const statistics = await this.ensureStatistics(id);
        const languages = statistics.usedLanguages;
        return findMostCommon(languages);
    }

    public async getMostUsedLanguages(): Promise<string[]> {
        const statistics = await this.findAll();
        const languages = statistics.flatMap(stat => stat.usedLanguages);

        const counts = languages.reduce((map, language) => {
            const count = map.get(language) ?? 0;
            map.set(language, count + 1);
            return map;
        }, new Map<string, number>());

        const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
        return sorted.map(([language]) => language);
    }
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
