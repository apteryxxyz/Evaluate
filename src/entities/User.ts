import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import type { FindOneOptions } from 'typeorm';
import { Base, createRepository } from './Base';
import { Snippet } from './Snippet';
import type { Executor } from '&services/Executor';

@Entity()
export class User extends Base {
    /** ID for the user, Discord ID. */
    @PrimaryColumn()
    public id!: string;

    /** List of snippets this user owns. */
    @OneToMany(() => Snippet, snippet => snippet.owner)
    public snippets!: Snippet[];

    /** List of every language this user has used. */
    @Column('simple-array')
    public usedLanguages: string[] = [''];

    /** Number of commands used. */
    @Column()
    public commandCount: number = 0;

    /** Number of evaluation this user has made. */
    @Column()
    public evaluationCount: number = 0;

    /** Number of captures this user has made. */
    @Column()
    public captureCount: number = 0;

    /** Whether this user has premium. */
    @Column()
    public hasPremium: boolean = false;

    /** If the user has premium, when it ends. */
    @Column()
    public premiumEndsAt: Date = new Date(0);

    public static repository = createRepository({
        __type: () => new User(),

        /** Ensures a user exists, if not, creates it. */
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

        /** Appends a language to the list of used languages. */
        async appendUsedLanguage(userId: string, language: Executor.Language) {
            const user = await this.ensureUser(userId);
            user.evaluationCount++;
            user.usedLanguages.push(language.key);
            await this.save(user);
        },

        /** Increments the command count. */
        async incrementCommandCount(userId: string) {
            const user = await this.ensureUser(userId);
            user.commandCount++;
            await this.save(user);
        },

        /** Increments the capture count. */
        async incrementCaptureCount(userId: string) {
            const user = await this.ensureUser(userId);
            user.captureCount++;
            await this.save(user);
        },

        /** Gets the statistics totals. */
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

        /** Gets the most used languages. */
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
