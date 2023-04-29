const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AddSnippet1682778989425 {
    name = 'AddSnippet1682778989425'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "snippet" ("createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "name" varchar NOT NULL, "language" varchar NOT NULL, "code" varchar NOT NULL, "input" varchar NOT NULL, "args" varchar NOT NULL)`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "snippet"`);
    }
}
