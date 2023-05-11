import type { User as DiscordUser } from 'discord.js';
import { Mixin } from 'ts-mixer';
import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import type { FindOneOptions } from 'typeorm';
import { Base, createRepository } from './Base';
import { Challenge } from './Challenge';
import { Snippet } from './Snippet';
import { Submission } from './Submission';
import { WithPremium } from './mixins/WithPremium';
import { WithStatistics } from './mixins/WithStatistics';

@Entity()
export class User extends Mixin(Base, WithStatistics, WithPremium) {
    /** ID for the user, Discord ID. */
    @PrimaryColumn()
    public id!: string;

    /** List of snippets this user owns. */
    @OneToMany(() => Snippet, snippet => snippet.owner)
    public snippets!: Snippet[];

    /** List of challenges this user has created. */
    @OneToMany(() => Challenge, challenge => challenge.author)
    public challenges!: Challenge[];

    /** List of submissions this user has made. */
    @OneToMany(() => Submission, submission => submission.submitter)
    public submissions!: Submission[];

    public static override repository = createRepository({
        __type: () => new User(),

        ...WithStatistics.repository,

        /** Ensures a user exists, if not, creates it. */
        async ensure(
            user: DiscordUser | string,
            options: FindOneOptions<User> = {}
        ) {
            const userId = typeof user === 'string' ? user : user.id;

            const existing = await this.findOne({
                where: { id: userId },
                ...options,
            });
            if (existing) return existing;

            const entity = new User();
            entity.id = userId;
            entity.snippets = [];
            return entity;
        },
    });
}
