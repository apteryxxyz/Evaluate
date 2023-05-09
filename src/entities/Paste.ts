import type { IPasteStruct } from 'rentry-pastebin';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Base, createRepository } from './Base';

@Entity()
export class Paste extends Base {
    public constructor(data?: IPasteStruct & { lifetime?: number }) {
        super();

        if (!data) return;
        this.id = data.url;
        this.editCode = data.editCode;
        this.lifetime = data.lifetime ?? -1;
    }

    /** Rentry ID. */
    @PrimaryColumn()
    public id!: string;

    /** Edit code for the pastebin. */
    @Column()
    public editCode!: string;

    /** How long in milliseconds until this pastebin should be deleted. */
    @Column()
    public lifetime: number = -1;

    public static repository = createRepository({
        __type: () => new Paste(),
    });
}
