import { MigrationInterface, QueryRunner } from "typeorm";

export class AddScheduleStatusToClientRequest1763397871909 implements MigrationInterface {
    name = 'AddScheduleStatusToClientRequest1763397871909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."clientRequests_status_enum" RENAME TO "clientRequests_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."clientRequests_status_enum" AS ENUM('new', 'dateDue', 'completed', 'declined', 'accepted', 'scheduled')`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ALTER COLUMN "status" TYPE "public"."clientRequests_status_enum" USING "status"::"text"::"public"."clientRequests_status_enum"`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ALTER COLUMN "status" SET DEFAULT 'new'`);
        await queryRunner.query(`DROP TYPE "public"."clientRequests_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."clientRequests_status_enum_old" AS ENUM('new', 'dateDue', 'completed', 'declined', 'accepted')`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ALTER COLUMN "status" TYPE "public"."clientRequests_status_enum_old" USING "status"::"text"::"public"."clientRequests_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ALTER COLUMN "status" SET DEFAULT 'new'`);
        await queryRunner.query(`DROP TYPE "public"."clientRequests_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."clientRequests_status_enum_old" RENAME TO "clientRequests_status_enum"`);
    }

}
