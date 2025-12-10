import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveEngagementAndFeedbackTable1763734146474 implements MigrationInterface {
    name = 'RemoveEngagementAndFeedbackTable1763734146474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "parentTaskId" uuid`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_34701b0b8d466af308ba202e4ef" FOREIGN KEY ("parentTaskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_34701b0b8d466af308ba202e4ef"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "parentTaskId"`);
    }

}
