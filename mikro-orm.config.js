const { defineConfig } = require('@mikro-orm/core');

module.exports = defineConfig({
    entities: ['./build/entities'],
    entitiesTs: ['./src/entities'],

    type: 'sqlite',
    dbName: './database/db.sqlite',

    migrations: {
        path: './database/migrations',
        emit: 'js',
        snapshot: true,
    },
});
