import { setTimeout } from 'node:timers';
import { container } from 'maclary';
import { DataSource } from 'typeorm';
import type { EntityTarget } from 'typeorm';

export const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'database/development.sqlite',
    entities: ['./src/entities/*.ts'],
    migrations: ['./database/migrations/*.js'],
    migrationsTableName: 'history',
    metadataTableName: 'metadata',
});

/** Handle the database and data source. */
export class Database {
    private _source?: DataSource;

    public constructor() {
        (async () => {
            dataSource
                .initialize()
                .then(() => (this._source = dataSource))
                .catch(error => console.error(error));
        })();
    }

    /** Shortland to the entity manager. */
    public get manager() {
        if (!this._source) throw new Error('Database not initialised');
        return this._source.manager;
    }

    /** Get an entities repository and extend it with the custom methods. */
    public repository<E extends object, R extends object>(
        target: EntityTarget<E> & { repository: R }
    ) {
        const repository = this.manager.getRepository(target);
        return repository.extend(target.repository);
    }

    /** Ensure that the database has been initialise. */
    public static async waitFor() {
        if (!container.database) container.database = new Database();

        while (!container.database._source)
            await new Promise(resolve => setTimeout(resolve, 100));
        return container.database;
    }
}

declare module 'maclary' {
    interface Container {
        database: Database;
    }
}
