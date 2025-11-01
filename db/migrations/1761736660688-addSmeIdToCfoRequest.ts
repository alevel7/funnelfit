import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSmeIdToCfoRequest1761736660688 implements MigrationInterface {
    name = 'AddSmeIdToCfoRequest1761736660688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sme_profiles" DROP CONSTRAINT "FK_dba6254dd21e586ee1db35cf122"`);
        await queryRunner.query(`ALTER TABLE "cfoRequests" ADD "smeId" uuid`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" ADD CONSTRAINT "FK_dba6254dd21e586ee1db35cf122" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cfoRequests" ADD CONSTRAINT "FK_efd019b507f31689105dd900918" FOREIGN KEY ("smeId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cfoRequests" DROP CONSTRAINT "FK_efd019b507f31689105dd900918"`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" DROP CONSTRAINT "FK_dba6254dd21e586ee1db35cf122"`);
        await queryRunner.query(`ALTER TABLE "cfoRequests" DROP COLUMN "smeId"`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" ADD CONSTRAINT "FK_dba6254dd21e586ee1db35cf122" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
