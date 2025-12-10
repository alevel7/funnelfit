import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClientRequestTable1761748181412 implements MigrationInterface {
    name = 'AddClientRequestTable1761748181412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cfoRequests" DROP CONSTRAINT "FK_efd019b507f31689105dd900918"`);
        await queryRunner.query(`CREATE TYPE "public"."clientRequests_status_enum" AS ENUM('new', 'dateDue', 'completed', 'declined', 'accepted')`);
        await queryRunner.query(`CREATE TABLE "clientRequests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scheduledMeetDate" TIMESTAMP NOT NULL DEFAULT now(), "isRequestAccepted" boolean NOT NULL DEFAULT false, "isMeetingCompleted" boolean NOT NULL DEFAULT false, "status" "public"."clientRequests_status_enum" NOT NULL DEFAULT 'new', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "requestId" uuid, "cfoId" uuid, CONSTRAINT "PK_76e5e2789965dc1ddcc5ac9beed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cfoRequests" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cfoRequests" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cfoRequests" ADD CONSTRAINT "FK_efd019b507f31689105dd900918" FOREIGN KEY ("smeId") REFERENCES "sme_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ADD CONSTRAINT "FK_62eec1ff3ba94cce463cdfd5b43" FOREIGN KEY ("requestId") REFERENCES "cfoRequests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ADD CONSTRAINT "FK_0f12e585b51ccf6f0e6f5540f47" FOREIGN KEY ("cfoId") REFERENCES "cfo_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clientRequests" DROP CONSTRAINT "FK_0f12e585b51ccf6f0e6f5540f47"`);
        await queryRunner.query(`ALTER TABLE "clientRequests" DROP CONSTRAINT "FK_62eec1ff3ba94cce463cdfd5b43"`);
        await queryRunner.query(`ALTER TABLE "cfoRequests" DROP CONSTRAINT "FK_efd019b507f31689105dd900918"`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "cfoRequests" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "cfoRequests" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" DROP COLUMN "createdAt"`);
        await queryRunner.query(`DROP TABLE "clientRequests"`);
        await queryRunner.query(`DROP TYPE "public"."clientRequests_status_enum"`);
        await queryRunner.query(`ALTER TABLE "cfoRequests" ADD CONSTRAINT "FK_efd019b507f31689105dd900918" FOREIGN KEY ("smeId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
