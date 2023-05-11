import { decorate } from 'ts-mixer';
import type { Repository } from 'typeorm';
import { Column } from 'typeorm';

export class WithStatistics {
    /** List of every language this has used. */
    @decorate(Column('simple-array'))
    public usedLanguages: string[] = [''];

    /** Most used language this has used. */
    public get mostUsedLanguage() {
        return findMostCommon(this.usedLanguages);
    }

    /** Number of commands this has used. */
    @decorate(Column())
    public commandCount: number = 0;

    /** Number of evaluation this has made. */
    @decorate(Column())
    public evaluationCount: number = 0;

    /** Number of captures this has made. */
    @decorate(Column())
    public captureCount: number = 0;

    public static repository = {
        /** Get the statistic totals.  */
        async getTotalStatistics(this: Repository<WithStatistics>) {
            const totals = {
                usedLanguages: [] as string[],
                commandCount: 0,
                evaluationCount: 0,
                captureCount: 0,
            };

            for (const entity of await this.find()) {
                totals.usedLanguages.push(...entity.usedLanguages);
                totals.commandCount += entity.commandCount;
                totals.evaluationCount += entity.evaluationCount;
                totals.captureCount += entity.captureCount;
            }

            const mostUsedLanguage = findMostCommon(totals.usedLanguages);
            return { ...totals, mostUsedLanguage };
        },

        /** Find the most used languages. */
        async getMostUsedLanguages(this: Repository<WithStatistics>) {
            const entities = await this.find();
            const languages = entities.flatMap(user => user.usedLanguages);

            const counts = languages.reduce((map, language) => {
                const count = map.get(language) ?? 0;
                map.set(language, count + 1);
                return map;
            }, new Map<string, number>());

            const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
            return sorted.map(([language]) => language).slice(0, 5);
        },
    };
}

/** Find the most common item in a list. */
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
