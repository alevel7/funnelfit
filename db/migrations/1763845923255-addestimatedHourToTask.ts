import { MigrationInterface, QueryRunner } from "typeorm";

export class AddestimatedHourToTask1763845923255 implements MigrationInterface {
    name = 'AddestimatedHourToTask1763845923255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "estimatedHours" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "estimatedHours"`);
    }

}
