import { container } from 'maclary';
import type { FindOptionsRelations, Repository } from 'typeorm';
import { BeforeUpdate, Column } from 'typeorm';

export abstract class Base {
    public abstract readonly id: unknown;

    @Column()
    public createdAt: Date = new Date();

    @Column({ type: 'datetime', nullable: true })
    public updatedAt: Date | null = null;

    @BeforeUpdate()
    public updateUpdatedAt() {
        this.updatedAt = new Date();
    }

    public async save() {
        const parent = Object.getPrototypeOf(this).constructor;
        const repository = container.database.repository(parent);
        await repository.save(this);
        return this;
    }

    public async delete() {
        const parent = Object.getPrototypeOf(this).constructor;
        const repository = container.database.repository(parent);
        await repository.remove(this);
        return this;
    }

    public async relations(relations: FindOptionsRelations<this>) {
        const parent = Object.getPrototypeOf(this).constructor;
        const repository = container.database.repository(parent);

        const that = await repository.findOne({
            where: { id: this.id },
            relations,
        });

        Object.assign(this, that);
        return this;
    }
}

export function createRepository<E extends Base, R>(
    custom: R & ThisType<Omit<R, '__type'> & Repository<E>> & { __type(): E }
): Omit<R, '__type'> {
    const { __type, ...rest } = custom;
    return rest;
}
