import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Base, createRepository } from './Base';
import { User } from './User';

@Entity()
export class Snippet extends Base {
    /** ID for the snippet, original message ID. */
    @PrimaryColumn()
    public id!: string;

    /** ID for the user, Discord ID. */
    @Column()
    public ownerId!: string;

    /** The user that owns this snippet. */
    @ManyToOne(() => User, user => user.snippets)
    public owner!: User;

    /** Name of the snippet. */
    @Column()
    public name!: string;

    /** Language of the snippet. */
    @Column()
    public language!: string;

    /** Code of the snippet. */
    @Column()
    public code!: string;

    /** Input of the snippet. */
    @Column()
    public input: string = '';

    /** Arguments of the snippet. */
    @Column()
    public args: string = '';

    public static repository = createRepository({
        __type: () => new Snippet(),
    });
}
