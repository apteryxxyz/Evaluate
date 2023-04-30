import type { FindOneOptions } from 'typeorm';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Base, createRepository } from './Base';
import { Snippet } from './Snippet';
import type { Executor } from '&services/Executor';

@Entity()
export class User extends Base {
    @PrimaryColumn()
    public id!: string;

    @OneToMany(() => Snippet, snippet => snippet.user)
    public snippets!: Snippet[];

    @Column('simple-array')
    public usedLanguages: string[] = [''];

    @Column()
    public commandCount: number = 0;

    @Column()
    public evaluationCount: number = 0;

    @Column()
    public captureCount: number = 0;

    @Column()
    public hasPremium: boolean = false;

    @Column()
    public premiumEndsAt: Date = new Date(0);

    public static repository = createRepository({
        __type: () => new User(),

        async ensureUser(userId: string, options: FindOneOptions<User> = {}) {
            const existing = await this.findOne({
                where: { id: userId },
                ...options,
            });
            if (existing) return existing;

            const user = new User();
            user.id = userId;
            if (
                Array.isArray(options?.relations) &&
                options.relations.includes('snippets')
            )
                user.snippets = [];

            return user;
        },

        async appendUsedLanguage(userId: string, language: Executor.Language) {
            const user = await this.ensureUser(userId);
            user.evaluationCount++;
            user.usedLanguages.push(language.key);
            await this.save(user);
        },

        async incrementCommandCount(userId: string) {
            const user = await this.ensureUser(userId);
            user.commandCount++;
            await this.save(user);
        },

        async incrementCaptureCount(userId: string) {
            const user = await this.ensureUser(userId);
            user.captureCount++;
            await this.save(user);
        },

        async getStatisticsTotals() {
            const users = await this.find();
            const totals = {
                usedLanguages: [] as string[],
                commandCount: 0,
                evaluationCount: 0,
                captureCount: 0,
            };

            for (const user of users) {
                totals.usedLanguages.push(...user.usedLanguages);
                totals.commandCount += user.commandCount;
                totals.evaluationCount += user.evaluationCount;
                totals.captureCount += user.captureCount;
            }

            const mostUsedLanguage = findMostCommon(totals.usedLanguages);
            return { ...totals, mostUsedLanguage };
        },

        async getMostUsedLanguages() {
            const users = await this.find();
            const languages = users.flatMap(stat => stat.usedLanguages);

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
