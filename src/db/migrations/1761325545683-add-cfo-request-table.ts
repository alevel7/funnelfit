import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCfoRequestTable1761325545683 implements MigrationInterface {
    name = 'AddCfoRequestTable1761325545683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."cfoRequests_urgencylevel_enum" AS ENUM('IMMEDIATE', 'URGENT', 'MODERATE', 'FLEXIBLE')`);
        await queryRunner.query(`CREATE TYPE "public"."cfoRequests_servicetype_enum" AS ENUM('CONSULTATION_PER_HOUR', 'PROJECT_BASED', 'ADVISORY_BOARD_MEMBER', 'INTERIM_CFO', 'FRACTIONAL_CFO')`);
        await queryRunner.query(`CREATE TYPE "public"."cfoRequests_cfoexperience_enum" AS ENUM('startup', 'small_business', 'medium_business', 'large_business', 'enterprise')`);
        await queryRunner.query(`CREATE TABLE "cfoRequests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "financialChallenge" text, "urgencyLevel" "public"."cfoRequests_urgencylevel_enum" NOT NULL, "serviceType" "public"."cfoRequests_servicetype_enum" NOT NULL, "cfoExperience" "public"."cfoRequests_cfoexperience_enum" NOT NULL, "otherRequirements" text, CONSTRAINT "PK_366177f243ff00dc09273dd6d1a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cfoRequests"`);
        await queryRunner.query(`DROP TYPE "public"."cfoRequests_cfoexperience_enum"`);
        await queryRunner.query(`DROP TYPE "public"."cfoRequests_servicetype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."cfoRequests_urgencylevel_enum"`);
    }

}
