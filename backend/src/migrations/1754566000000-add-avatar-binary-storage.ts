import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarBinaryStorage1754566000000 implements MigrationInterface {
    name = 'AddAvatarBinaryStorage1754566000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD COLUMN "avatarData" bytea,
            ADD COLUMN "avatarMimeType" character varying(50),
            ADD COLUMN "avatarSize" integer
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            DROP COLUMN "avatarData",
            DROP COLUMN "avatarMimeType",
            DROP COLUMN "avatarSize"
        `);
    }
}
