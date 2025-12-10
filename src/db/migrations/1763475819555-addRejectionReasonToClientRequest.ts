import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRejectionReasonToClientRequest1763475819555 implements MigrationInterface {
    name = 'AddRejectionReasonToClientRequest1763475819555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clientRequests" ADD "rejectionReason" text`);
        await queryRunner.query(`ALTER TABLE "clientRequests" DROP CONSTRAINT "FK_0f12e585b51ccf6f0e6f5540f47"`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ALTER COLUMN "cfoId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ADD CONSTRAINT "FK_0f12e585b51ccf6f0e6f5540f47" FOREIGN KEY ("cfoId") REFERENCES "cfo_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clientRequests" DROP CONSTRAINT "FK_0f12e585b51ccf6f0e6f5540f47"`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ALTER COLUMN "cfoId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ADD CONSTRAINT "FK_0f12e585b51ccf6f0e6f5540f47" FOREIGN KEY ("cfoId") REFERENCES "cfo_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clientRequests" DROP COLUMN "rejectionReason"`);
    }

}
