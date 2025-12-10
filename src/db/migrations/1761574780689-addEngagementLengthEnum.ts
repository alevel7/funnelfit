import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEngagementLengthEnum1761574780689 implements MigrationInterface {
    name = 'AddEngagementLengthEnum1761574780689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cfo_profiles" DROP COLUMN "engagementLength"`);
        await queryRunner.query(`CREATE TYPE "public"."cfo_profiles_engagementlength_enum" AS ENUM('1-3_months', '3-6_months', '6-12_months', '12-24_months', '2+_years', 'ongoing', 'project_based')`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" ADD "engagementLength" "public"."cfo_profiles_engagementlength_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cfo_profiles" DROP COLUMN "engagementLength"`);
        await queryRunner.query(`DROP TYPE "public"."cfo_profiles_engagementlength_enum"`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" ADD "engagementLength" text`);
    }

}
