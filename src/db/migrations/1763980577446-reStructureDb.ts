import { MigrationInterface, QueryRunner } from "typeorm";

export class ReStructureDb1763980577446 implements MigrationInterface {
    name = 'ReStructureDb1763980577446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_70cd2eddbbfccf96e05c14eefde"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_ebccec59e8a7bf8f4c1e0e7e8bb"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956"`);
        await queryRunner.query(`ALTER TABLE "clientRequests" DROP CONSTRAINT "FK_be5596462247ddb1b88620783c4"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "cfoId"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "smeId"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "clientRequests" DROP COLUMN "smeId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clientRequests" ADD "smeId" uuid`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "projectId" uuid`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "smeId" uuid`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "cfoId" uuid`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ADD CONSTRAINT "FK_be5596462247ddb1b88620783c4" FOREIGN KEY ("smeId") REFERENCES "sme_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956" FOREIGN KEY ("projectId") REFERENCES "cfoRequests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_ebccec59e8a7bf8f4c1e0e7e8bb" FOREIGN KEY ("smeId") REFERENCES "sme_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_70cd2eddbbfccf96e05c14eefde" FOREIGN KEY ("cfoId") REFERENCES "cfo_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
