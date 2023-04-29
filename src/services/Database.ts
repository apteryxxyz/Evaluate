import { setTimeout } from 'node:timers';
import type { EntityName } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import type { SqliteDriver } from '@mikro-orm/sqlite';
import { container } from 'maclary';

/** Handle the database and ORM. */
export class Database {
    private _orm?: Awaited<ReturnType<typeof MikroORM.init>>;

    public constructor() {
        (async () => {
            const config = require('../../mikro-orm.config');
            const orm = await MikroORM.init<SqliteDriver>(config);

            // Ensure that the database exists and is up to date
            const generator = orm.getSchemaGenerator();
            await generator.ensureDatabase();
            await generator.updateSchema();

            this._orm = orm;
        })();
    }

    /** Shorthand to the ORM. */
    public get orm() {
        if (!this._orm) throw new Error('Database is not ready');
        return this._orm;
    }

    /** Shorthand to the entity manager. */
    public get em() {
        return this.orm.em;
    }

    /** Shorthand for getting the repository of an entity. */
    public get<T extends object>(entity: EntityName<T>) {
        return this.orm.em.getRepository(entity);
    }

    /** Ensure that the database has been initialise. */
    public static async waitFor() {
        if (!container.database) container.database = new Database();

        while (!container.database._orm) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return container.database;
    }
}

declare module 'maclary' {
    interface Container {
        database: Database;
    }
}
