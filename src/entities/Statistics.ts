import {
    Entity,
    EntityRepository,
    EntityRepositoryType,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';

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

    public async appendLanguage(id: string, language: string) {
        const statistics = await this.ensureStatistics(id);
        statistics.usedLanguages.push(language);
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

    public async getFavouriteLanguage(id: string) {
        const statistics = await this.ensureStatistics(id);
        const languages = statistics.usedLanguages;
        const map = new Map<string, number>();

        for (const language of languages) {
            const count = map.get(language) ?? 0;
            map.set(language, count + 1);
        }

        let max = 0;
        let favourite = '';
        for (const [language, count] of map.entries()) {
            if (count > max) {
                max = count;
                favourite = language;
            }
        }

        return favourite;
    }
}
