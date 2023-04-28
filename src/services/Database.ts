import { setTimeout } from 'node:timers';
import type { EntityName } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import type { SqliteDriver } from '@mikro-orm/sqlite';
import { container } from 'maclary';
// import { Paste } from '&entities/Paste';
// import { Snippet } from '&entities/Snippet';

export class Database {
    private _orm?: Awaited<ReturnType<typeof MikroORM.init>>;

    public constructor() {
        (async () => {
            this._orm = await MikroORM.init<SqliteDriver>(
                require('../../mikro-orm.config')
            );

            const generator = this._orm.getSchemaGenerator();
            await generator.ensureDatabase();
            await generator.updateSchema();
        })();
    }

    public get orm() {
        if (!this._orm) throw new Error('Database is not ready');
        return this._orm;
    }

    public get em() {
        return this.orm.em;
    }

    public get<T extends object>(entity: EntityName<T>) {
        return this.orm.em.getRepository(entity);
    }

    public static async waitFor() {
        if (!container.database) container.database = new Database();

        while (!container.database._orm) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return container.database;
    }
}
