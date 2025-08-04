import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationData1754156683867 implements MigrationInterface {
    name = 'MigrationData1754156683867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "phone" character varying(255) NOT NULL
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a000cca60bcf04454e72769949" ON "users" ("phone")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_a000cca60bcf04454e72769949"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "phone"
        `);
    }

}
