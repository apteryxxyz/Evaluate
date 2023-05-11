import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Base, createRepository } from './Base';
import { Submission } from './Submission';
import { User } from './User';

/*
const challenge = new Challenge();
challenge.authorId = message.author.id;
challenge.title = 'Square A Number';
challenge.description = 'Given a number, return it squared.';
challenge.difficulty = Challenge.Difficulty.Easy;
challenge.tests = [
    { input: '1', output: '1' },
    { input: '2', output: '4' },
    { input: '3', output: '9' },
    { input: '4', output: '16' },
    { input: '5', output: '25' },
    { input: '6', output: '36' },
    { input: '7', output: '49' },
    { input: '8', output: '64' },
    { input: '9', output: '81' },
    { input: '10', output: '100' },
];
await challenge.save();
*/

@Entity()
export class Challenge extends Base {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public authorId!: string;

    @ManyToOne(() => User, user => user.challenges)
    public author!: User;

    @Column()
    public title!: string;

    @Column()
    public description!: string;

    @Column()
    public difficulty!: Challenge.Difficulty;

    @Column('simple-json')
    public tests: Challenge.Test[] = [];

    @OneToMany(() => Submission, submission => submission.challenge)
    public submissions!: Submission[];

    public override toString() {
        return `#${this.id} - ${this.title}`;
    }

    public static repository = createRepository({
        __type: () => new Challenge(),

        async getLatest() {
            return this.find({
                order: { createdAt: 'DESC' },
                take: 1,
                relations: ['submissions'],
            }) //
                .then(challenges => challenges[0]);
        },

        async searchQuery(query: string) {
            if (!query)
                return this.find({ order: { createdAt: 'DESC' }, take: 10 });

            return this.createQueryBuilder('challenge')
                .where('challenge.title ILIKE :query', { query: `%${query}%` })
                .orWhere('challenge.description ILIKE :query', {
                    query: `%${query}%`,
                })
                .take(10)
                .getMany();
        },
    });
}

export namespace Challenge {
    export enum Difficulty {
        Easy = 'easy',
        Medium = 'medium',
        Hard = 'hard',
        Extreme = 'extreme',
    }

    export interface Test {
        input: string;
        output: string;
    }
}
