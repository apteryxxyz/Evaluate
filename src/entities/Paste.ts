import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Base, createRepository } from './Base';

@Entity()
export class Paste extends Base {
    @PrimaryColumn()
    public id!: string;

    @Column()
    public editCode!: string;

    @Column()
    public lifetime: number = -1;

    public static repository = createRepository({
        __type: () => new Paste(),
    });
}
