import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAboutMeAndRoleToCfoProfile1763995574659 implements MigrationInterface {
    name = 'AddAboutMeAndRoleToCfoProfile1763995574659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cfo_profiles" ADD "aboutMe" text`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" ADD "role" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cfo_profiles" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" DROP COLUMN "aboutMe"`);
    }

}
