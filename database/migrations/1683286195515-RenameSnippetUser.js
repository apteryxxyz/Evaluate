const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class RenameSnippetUser1683286195515 {
    name = 'RenameSnippetUser1683286195515'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "temporary_snippet" ("createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "name" varchar NOT NULL, "language" varchar NOT NULL, "code" varchar NOT NULL, "input" varchar NOT NULL, "args" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_snippet"("createdAt", "updatedAt", "id", "userId", "name", "language", "code", "input", "args") SELECT "createdAt", "updatedAt", "id", "userId", "name", "language", "code", "input", "args" FROM "snippet"`);
        await queryRunner.query(`DROP TABLE "snippet"`);
        await queryRunner.query(`ALTER TABLE "temporary_snippet" RENAME TO "snippet"`);
        await queryRunner.query(`CREATE TABLE "temporary_snippet" ("createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "ownerId" varchar NOT NULL, "name" varchar NOT NULL, "language" varchar NOT NULL, "code" varchar NOT NULL, "input" varchar NOT NULL, "args" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_snippet"("createdAt", "updatedAt", "id", "ownerId", "name", "language", "code", "input", "args") SELECT "createdAt", "updatedAt", "id", "userId", "name", "language", "code", "input", "args" FROM "snippet"`);
        await queryRunner.query(`DROP TABLE "snippet"`);
        await queryRunner.query(`ALTER TABLE "temporary_snippet" RENAME TO "snippet"`);
        await queryRunner.query(`CREATE TABLE "temporary_snippet" ("createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "ownerId" varchar NOT NULL, "name" varchar NOT NULL, "language" varchar NOT NULL, "code" varchar NOT NULL, "input" varchar NOT NULL, "args" varchar NOT NULL, CONSTRAINT "FK_4429e841d673206683cd4bcd7fb" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_snippet"("createdAt", "updatedAt", "id", "ownerId", "name", "language", "code", "input", "args") SELECT "createdAt", "updatedAt", "id", "ownerId", "name", "language", "code", "input", "args" FROM "snippet"`);
        await queryRunner.query(`DROP TABLE "snippet"`);
        await queryRunner.query(`ALTER TABLE "temporary_snippet" RENAME TO "snippet"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "snippet" RENAME TO "temporary_snippet"`);
        await queryRunner.query(`CREATE TABLE "snippet" ("createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "ownerId" varchar NOT NULL, "name" varchar NOT NULL, "language" varchar NOT NULL, "code" varchar NOT NULL, "input" varchar NOT NULL, "args" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "snippet"("createdAt", "updatedAt", "id", "ownerId", "name", "language", "code", "input", "args") SELECT "createdAt", "updatedAt", "id", "ownerId", "name", "language", "code", "input", "args" FROM "temporary_snippet"`);
        await queryRunner.query(`DROP TABLE "temporary_snippet"`);
        await queryRunner.query(`ALTER TABLE "snippet" RENAME TO "temporary_snippet"`);
        await queryRunner.query(`CREATE TABLE "snippet" ("createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "name" varchar NOT NULL, "language" varchar NOT NULL, "code" varchar NOT NULL, "input" varchar NOT NULL, "args" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "snippet"("createdAt", "updatedAt", "id", "userId", "name", "language", "code", "input", "args") SELECT "createdAt", "updatedAt", "id", "ownerId", "name", "language", "code", "input", "args" FROM "temporary_snippet"`);
        await queryRunner.query(`DROP TABLE "temporary_snippet"`);
        await queryRunner.query(`ALTER TABLE "snippet" RENAME TO "temporary_snippet"`);
        await queryRunner.query(`CREATE TABLE "snippet" ("createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "name" varchar NOT NULL, "language" varchar NOT NULL, "code" varchar NOT NULL, "input" varchar NOT NULL, "args" varchar NOT NULL, CONSTRAINT "FK_da314b917a063a91ffbc59b28e6" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "snippet"("createdAt", "updatedAt", "id", "userId", "name", "language", "code", "input", "args") SELECT "createdAt", "updatedAt", "id", "userId", "name", "language", "code", "input", "args" FROM "temporary_snippet"`);
        await queryRunner.query(`DROP TABLE "temporary_snippet"`);
    }
}
