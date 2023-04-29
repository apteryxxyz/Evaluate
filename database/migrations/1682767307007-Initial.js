const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Initial1682767307007 {
    name = 'Initial1682767307007'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "paste" ("createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "editCode" varchar NOT NULL, "lifetime" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "statistics" ("createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "usedLanguages" text NOT NULL, "commandCount" integer NOT NULL, "evaluatorCount" integer NOT NULL, "captureCount" integer NOT NULL)`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "statistics"`);
        await queryRunner.query(`DROP TABLE "paste"`);
    }
}
