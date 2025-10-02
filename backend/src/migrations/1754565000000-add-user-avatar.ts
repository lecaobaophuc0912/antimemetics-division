import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAvatar1754565000000 implements MigrationInterface {
    name = 'AddUserAvatar1754565000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD COLUMN "avatarUrl" character varying(512)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            DROP COLUMN "avatarUrl"
        `);
    }
}


