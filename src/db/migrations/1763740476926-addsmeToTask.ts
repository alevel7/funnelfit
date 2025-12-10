import { MigrationInterface, QueryRunner } from "typeorm";

export class AddsmeToTask1763740476926 implements MigrationInterface {
    name = 'AddsmeToTask1763740476926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "smeId" uuid`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_ebccec59e8a7bf8f4c1e0e7e8bb" FOREIGN KEY ("smeId") REFERENCES "sme_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_ebccec59e8a7bf8f4c1e0e7e8bb"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "smeId"`);
    }

}
