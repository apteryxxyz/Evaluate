import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Base, createRepository } from './Base';
import { User } from './User';

@Entity()
export class Snippet extends Base {
    @PrimaryColumn()
    public id!: string;

    @Column()
    public ownerId!: string;

    @ManyToOne(() => User, user => user.snippets)
    public owner!: User;

    @Column()
    public name!: string;

    @Column()
    public language!: string;

    @Column()
    public code!: string;

    @Column()
    public input: string = '';

    @Column()
    public args: string = '';

    public static repository = createRepository({
        __type: () => new Snippet(),
    });
}
