import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeCFOrequestFinancialChallengeToJsonb1761725802564 implements MigrationInterface {
    name = 'ChangeCFOrequestFinancialChallengeToJsonb1761725802564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cfoRequests" DROP COLUMN "financialChallenge"`);
        await queryRunner.query(`ALTER TABLE "cfoRequests" ADD "financialChallenge" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cfoRequests" DROP COLUMN "financialChallenge"`);
        await queryRunner.query(`ALTER TABLE "cfoRequests" ADD "financialChallenge" text`);
    }

}
