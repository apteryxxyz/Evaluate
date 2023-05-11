import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Base, createRepository } from './Base';
import { Challenge } from './Challenge';
import { User } from './User';

@Entity()
export class Submission extends Base {
    @PrimaryColumn()
    public id!: string;

    @Column()
    public submitterId!: string;

    @ManyToOne(() => User, user => user.submissions)
    public submitter!: User;

    @Column()
    public challengeId!: number;

    @ManyToOne(() => Challenge, challenge => challenge.submissions)
    public challenge!: Challenge;

    /** Language of the submission code. */
    @Column()
    public language!: string;

    /** Code of the submission. */
    @Column()
    public code!: string;

    @Column()
    public score!: number;

    public static repository = createRepository({
        __type: () => new Submission(),

        async getLeaderboard() {
            const leaderboard = new Map<string, number>();

            for (const submission of await this.find()) {
                if (!leaderboard.has(submission.submitterId))
                    leaderboard.set(submission.submitterId, 0);

                const currentScore = leaderboard.get(submission.submitterId)!;
                leaderboard.set(
                    submission.submitterId,
                    currentScore + submission.score
                );
            }

            return [...leaderboard.entries()].sort((a, b) => b[1] - a[1]);
        },
    });
}
