import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationData1754563485328 implements MigrationInterface {
    name = 'MigrationData1754563485328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."todos_status_enum" AS ENUM('pending', 'in-progress', 'completed')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."todos_priority_enum" AS ENUM('low', 'medium', 'high')
        `);
        await queryRunner.query(`
            CREATE TABLE "todos" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "code" text NOT NULL,
                "title" text NOT NULL,
                "description" text NOT NULL,
                "status" "public"."todos_status_enum" NOT NULL,
                "priority" "public"."todos_priority_enum" NOT NULL,
                "dueDate" TIMESTAMP NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "user_id" uuid,
                CONSTRAINT "UQ_30cc4cd561dde85f902245bc299" UNIQUE ("code"),
                CONSTRAINT "PK_ca8cafd59ca6faaf67995344225" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "refresh_tokens" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "token" character varying(255) NOT NULL,
                "userId" uuid NOT NULL,
                "expiresAt" TIMESTAMP NOT NULL,
                "isRevoked" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "email" character varying(255) NOT NULL,
                "password" character varying(255) NOT NULL,
                "role" character varying(50) NOT NULL DEFAULT 'user',
                "phone" character varying(255),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a000cca60bcf04454e72769949" ON "users" ("phone")
        `);
        await queryRunner.query(`
            ALTER TABLE "todos"
            ADD CONSTRAINT "FK_53511787e1f412d746c4bf223ff" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"
        `);
        await queryRunner.query(`
            ALTER TABLE "todos" DROP CONSTRAINT "FK_53511787e1f412d746c4bf223ff"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_a000cca60bcf04454e72769949"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TABLE "refresh_tokens"
        `);
        await queryRunner.query(`
            DROP TABLE "todos"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."todos_priority_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."todos_status_enum"
        `);
    }

}
