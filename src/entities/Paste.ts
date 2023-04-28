import {
    Entity,
    EntityRepository,
    EntityRepositoryType,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';

export class PasteRepository extends EntityRepository<Paste> {}

@Entity({ customRepository: () => PasteRepository })
export class Paste {
    public [EntityRepositoryType]?: PasteRepository;

    @PrimaryKey()
    public id!: string;

    @Property()
    public editCode!: string;

    @Property()
    public lifetime: number = -1;

    @Property()
    public createdAt: Date = new Date();
}
