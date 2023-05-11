import { Guild as DiscordGuild } from 'discord.js';
import { Mixin } from 'ts-mixer';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Base, createRepository } from './Base';
import { WithPremium } from './mixins/WithPremium';
import { WithStatistics } from './mixins/WithStatistics';

@Entity()
export class Guild extends Mixin(Base, WithStatistics, WithPremium) {
    @PrimaryColumn()
    public id!: string;

    @Column({ type: 'text', nullable: true })
    public challengeChannelId: string | null = null;

    @Column({ type: 'text', nullable: true })
    public challengeRoleId: string | null = null;

    public static override repository = createRepository({
        __type: () => new Guild(),

        ...WithStatistics.repository,

        async ensure(guild: DiscordGuild | string) {
            const guildId = typeof guild === 'string' ? guild : guild.id;

            const existing = await this.findOne({ where: { id: guildId } });
            if (existing) return existing;

            const entity = new Guild();
            entity.id = guildId;
            entity.createdAt =
                (guild instanceof DiscordGuild
                    ? guild.members.me?.joinedAt
                    : null) ?? new Date();
            return entity;
        },
    });
}
