import 'reflect-metadata';
import { setTimeout } from 'node:timers';
import { container } from 'maclary';
import { DataSource } from 'typeorm';
import type { EntityTarget } from 'typeorm';

export const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'database/db.sqlite',
    entities: ['./build/entities/*.js'],
    migrations: ['./database/migrations/*.js'],
    migrationsTableName: 'typeorm_history',
    metadataTableName: 'typeorm_metadata',
});

/** Database instance providing easy access to TypeORM. */
export class Database {
    private _source = dataSource;

    public constructor() {
        void this._source.initialize();
    }

    /** Shortland to the entity manager. */
    public get manager() {
        return this._source.manager;
    }

    /** Get an entities repository and extend it with the custom methods. */
    public repository<E extends object, R extends object>(
        target: EntityTarget<E> & { repository: R }
    ) {
        return this.manager.getRepository(target).extend(target.repository);
    }

    /** Ensure the database has been initialise. */
    public static async waitFor() {
        if (!container.database) container.database = new Database();
        while (!container.database._source.isInitialized)
            await new Promise(resolve => setTimeout(resolve, 100));
        return container.database;
    }
}

declare module 'maclary' {
    interface Container {
        database: Database;
    }
}
