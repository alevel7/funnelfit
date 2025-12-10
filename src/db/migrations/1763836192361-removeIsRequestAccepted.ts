import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveIsRequestAccepted1763836192361 implements MigrationInterface {
    name = 'RemoveIsRequestAccepted1763836192361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clientRequests" RENAME COLUMN "isRequestAccepted" TO "smeId"`);
        await queryRunner.query(`ALTER TABLE "clientRequests" DROP COLUMN "smeId"`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ADD "smeId" uuid`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ADD CONSTRAINT "FK_be5596462247ddb1b88620783c4" FOREIGN KEY ("smeId") REFERENCES "sme_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clientRequests" DROP CONSTRAINT "FK_be5596462247ddb1b88620783c4"`);
        await queryRunner.query(`ALTER TABLE "clientRequests" DROP COLUMN "smeId"`);
        await queryRunner.query(`ALTER TABLE "clientRequests" ADD "smeId" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "clientRequests" RENAME COLUMN "smeId" TO "isRequestAccepted"`);
    }

}
