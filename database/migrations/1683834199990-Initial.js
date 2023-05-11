const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Initial1683834199990 {
    name = 'Initial1683834199990'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "paste" ("createdAt" datetime NOT NULL, "updatedAt" datetime, "id" varchar PRIMARY KEY NOT NULL, "editCode" varchar NOT NULL, "lifetime" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "snippet" ("createdAt" datetime NOT NULL, "updatedAt" datetime, "id" varchar PRIMARY KEY NOT NULL, "ownerId" varchar NOT NULL, "name" varchar NOT NULL, "language" varchar NOT NULL, "code" varchar NOT NULL, "input" varchar NOT NULL, "args" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user" ("usedLanguages" text NOT NULL, "commandCount" integer NOT NULL, "evaluationCount" integer NOT NULL, "captureCount" integer NOT NULL, "premiumEndsAt" datetime, "id" varchar PRIMARY KEY NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "submission" ("createdAt" datetime NOT NULL, "updatedAt" datetime, "id" varchar PRIMARY KEY NOT NULL, "submitterId" varchar NOT NULL, "challengeId" integer NOT NULL, "language" varchar NOT NULL, "code" varchar NOT NULL, "score" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "challenge" ("createdAt" datetime NOT NULL, "updatedAt" datetime, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "authorId" varchar NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "difficulty" varchar NOT NULL, "tests" text NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "guild" ("usedLanguages" text NOT NULL, "commandCount" integer NOT NULL, "evaluationCount" integer NOT NULL, "captureCount" integer NOT NULL, "premiumEndsAt" datetime, "id" varchar PRIMARY KEY NOT NULL, "challengeChannelId" text, "challengeRoleId" text)`);
        await queryRunner.query(`CREATE TABLE "temporary_snippet" ("createdAt" datetime NOT NULL, "updatedAt" datetime, "id" varchar PRIMARY KEY NOT NULL, "ownerId" varchar NOT NULL, "name" varchar NOT NULL, "language" varchar NOT NULL, "code" varchar NOT NULL, "input" varchar NOT NULL, "args" varchar NOT NULL, CONSTRAINT "FK_4429e841d673206683cd4bcd7fb" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_snippet"("createdAt", "updatedAt", "id", "ownerId", "name", "language", "code", "input", "args") SELECT "createdAt", "updatedAt", "id", "ownerId", "name", "language", "code", "input", "args" FROM "snippet"`);
        await queryRunner.query(`DROP TABLE "snippet"`);
        await queryRunner.query(`ALTER TABLE "temporary_snippet" RENAME TO "snippet"`);
        await queryRunner.query(`CREATE TABLE "temporary_submission" ("createdAt" datetime NOT NULL, "updatedAt" datetime, "id" varchar PRIMARY KEY NOT NULL, "submitterId" varchar NOT NULL, "challengeId" integer NOT NULL, "language" varchar NOT NULL, "code" varchar NOT NULL, "score" integer NOT NULL, CONSTRAINT "FK_e5f4d46cd1d0c691ac9d80e3064" FOREIGN KEY ("submitterId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_d3af0954e5f8c6c9ee89e9dd989" FOREIGN KEY ("challengeId") REFERENCES "challenge" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_submission"("createdAt", "updatedAt", "id", "submitterId", "challengeId", "language", "code", "score") SELECT "createdAt", "updatedAt", "id", "submitterId", "challengeId", "language", "code", "score" FROM "submission"`);
        await queryRunner.query(`DROP TABLE "submission"`);
        await queryRunner.query(`ALTER TABLE "temporary_submission" RENAME TO "submission"`);
        await queryRunner.query(`CREATE TABLE "temporary_challenge" ("createdAt" datetime NOT NULL, "updatedAt" datetime, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "authorId" varchar NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "difficulty" varchar NOT NULL, "tests" text NOT NULL, CONSTRAINT "FK_054c35ac0dc91e24bd1be24ee74" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_challenge"("createdAt", "updatedAt", "id", "authorId", "title", "description", "difficulty", "tests") SELECT "createdAt", "updatedAt", "id", "authorId", "title", "description", "difficulty", "tests" FROM "challenge"`);
        await queryRunner.query(`DROP TABLE "challenge"`);
        await queryRunner.query(`ALTER TABLE "temporary_challenge" RENAME TO "challenge"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "challenge" RENAME TO "temporary_challenge"`);
        await queryRunner.query(`CREATE TABLE "challenge" ("createdAt" datetime NOT NULL, "updatedAt" datetime, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "authorId" varchar NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "difficulty" varchar NOT NULL, "tests" text NOT NULL)`);
        await queryRunner.query(`INSERT INTO "challenge"("createdAt", "updatedAt", "id", "authorId", "title", "description", "difficulty", "tests") SELECT "createdAt", "updatedAt", "id", "authorId", "title", "description", "difficulty", "tests" FROM "temporary_challenge"`);
        await queryRunner.query(`DROP TABLE "temporary_challenge"`);
        await queryRunner.query(`ALTER TABLE "submission" RENAME TO "temporary_submission"`);
        await queryRunner.query(`CREATE TABLE "submission" ("createdAt" datetime NOT NULL, "updatedAt" datetime, "id" varchar PRIMARY KEY NOT NULL, "submitterId" varchar NOT NULL, "challengeId" integer NOT NULL, "language" varchar NOT NULL, "code" varchar NOT NULL, "score" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "submission"("createdAt", "updatedAt", "id", "submitterId", "challengeId", "language", "code", "score") SELECT "createdAt", "updatedAt", "id", "submitterId", "challengeId", "language", "code", "score" FROM "temporary_submission"`);
        await queryRunner.query(`DROP TABLE "temporary_submission"`);
        await queryRunner.query(`ALTER TABLE "snippet" RENAME TO "temporary_snippet"`);
        await queryRunner.query(`CREATE TABLE "snippet" ("createdAt" datetime NOT NULL, "updatedAt" datetime, "id" varchar PRIMARY KEY NOT NULL, "ownerId" varchar NOT NULL, "name" varchar NOT NULL, "language" varchar NOT NULL, "code" varchar NOT NULL, "input" varchar NOT NULL, "args" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "snippet"("createdAt", "updatedAt", "id", "ownerId", "name", "language", "code", "input", "args") SELECT "createdAt", "updatedAt", "id", "ownerId", "name", "language", "code", "input", "args" FROM "temporary_snippet"`);
        await queryRunner.query(`DROP TABLE "temporary_snippet"`);
        await queryRunner.query(`DROP TABLE "guild"`);
        await queryRunner.query(`DROP TABLE "challenge"`);
        await queryRunner.query(`DROP TABLE "submission"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "snippet"`);
        await queryRunner.query(`DROP TABLE "paste"`);
    }
}
