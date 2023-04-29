import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Base, createRepository } from './Base';

@Entity()
export class Snippet extends Base {
    @PrimaryColumn()
    public id!: string;

    @Column()
    public userId!: string;

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
