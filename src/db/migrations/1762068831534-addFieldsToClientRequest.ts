import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsToClientRequest1762068831534 implements MigrationInterface {
    name = 'AddFieldsToClientRequest1762068831534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clientRequests" ADD "meetingDurationInMinutes" integer`);
        await queryRunner.query(`CREATE TYPE "public"."clientRequests_meetingmode_enum" AS ENUM('IN_PERSON', 'PHONE_CALL', 'VIDEO_CALL')`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ADD "meetingMode" "public"."clientRequests_meetingmode_enum"`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ADD "additionalNotes" text`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ALTER COLUMN "scheduledMeetDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ALTER COLUMN "scheduledMeetDate" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clientRequests" ALTER COLUMN "scheduledMeetDate" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ALTER COLUMN "scheduledMeetDate" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clientRequests" DROP COLUMN "additionalNotes"`);
        await queryRunner.query(`ALTER TABLE "clientRequests" DROP COLUMN "meetingMode"`);
        await queryRunner.query(`DROP TYPE "public"."clientRequests_meetingmode_enum"`);
        await queryRunner.query(`ALTER TABLE "clientRequests" DROP COLUMN "meetingDurationInMinutes"`);
    }

}
