import type { Repository } from 'typeorm';
import { BeforeUpdate, Column } from 'typeorm';

export abstract class Base {
    @Column()
    public createdAt: Date = new Date();

    @Column()
    public updatedAt: Date = new Date();

    @BeforeUpdate()
    public updateUpdatedAt() {
        this.updatedAt = new Date();
    }
}

export function createRepository<E extends Base, R>(
    custom: { __type(): E } & R & ThisType<Repository<E> & Omit<R, '__type'>>
): Omit<R, '__type'> {
    const { __type, ...rest } = custom;
    return rest;
}
