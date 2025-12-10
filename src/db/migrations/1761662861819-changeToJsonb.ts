import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeToJsonb1761662861819 implements MigrationInterface {
    name = 'ChangeToJsonb1761662861819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cfo_profiles" DROP COLUMN "certifications"`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" ADD "certifications" jsonb`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" DROP COLUMN "expertiseAreas"`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" ADD "expertiseAreas" jsonb`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" DROP COLUMN "industries"`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" ADD "industries" jsonb`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" DROP COLUMN "companySize"`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" ADD "companySize" jsonb`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" DROP COLUMN "yearsOfExperience"`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" ADD "yearsOfExperience" jsonb`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" DROP COLUMN "companyinfo"`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" ADD "companyinfo" jsonb DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" DROP COLUMN "engagementDuration"`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" ADD "engagementDuration" jsonb DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" DROP COLUMN "contactPerson"`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" ADD "contactPerson" jsonb DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" DROP COLUMN "financialGoal"`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" ADD "financialGoal" jsonb DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" DROP COLUMN "areaOfNeed"`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" ADD "areaOfNeed" jsonb DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sme_profiles" DROP COLUMN "areaOfNeed"`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" ADD "areaOfNeed" text DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" DROP COLUMN "financialGoal"`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" ADD "financialGoal" text DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" DROP COLUMN "contactPerson"`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" ADD "contactPerson" text DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" DROP COLUMN "engagementDuration"`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" ADD "engagementDuration" text DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" DROP COLUMN "companyinfo"`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" ADD "companyinfo" text DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" DROP COLUMN "yearsOfExperience"`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" ADD "yearsOfExperience" text`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" DROP COLUMN "companySize"`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" ADD "companySize" text`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" DROP COLUMN "industries"`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" ADD "industries" text`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" DROP COLUMN "expertiseAreas"`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" ADD "expertiseAreas" text`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" DROP COLUMN "certifications"`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" ADD "certifications" text`);
    }

}
