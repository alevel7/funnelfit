import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTaskTable1763719624580 implements MigrationInterface {
    name = 'AddTaskTable1763719624580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_e439a1935c597dc7505e003fbe1"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_a71800925c1bb5c31ed516effad"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "due_date"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "engagementId"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "assignedById"`);
        await queryRunner.query(`ALTER TABLE "cfoRequests" ADD "projectName" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "taskType" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT')`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "priority" "public"."tasks_priority_enum" NOT NULL DEFAULT 'LOW'`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "dueDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "businessObjective" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "expectedOutcome" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "budget" numeric`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "tags" text`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "stakeHolders" text`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_acceptancestatus_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "acceptanceStatus" "public"."tasks_acceptancestatus_enum" NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "requestId" uuid`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "cfoId" uuid`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "title" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."tasks_status_enum" RENAME TO "tasks_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED', 'COMPLETED')`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "status" TYPE "public"."tasks_status_enum" USING "status"::"text"::"public"."tasks_status_enum"`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'TODO'`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_8a9ffc661943ed7d808a6cd6ad9" FOREIGN KEY ("requestId") REFERENCES "clientRequests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_70cd2eddbbfccf96e05c14eefde" FOREIGN KEY ("cfoId") REFERENCES "cfo_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_70cd2eddbbfccf96e05c14eefde"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_8a9ffc661943ed7d808a6cd6ad9"`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum_old" AS ENUM('OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "status" TYPE "public"."tasks_status_enum_old" USING "status"::"text"::"public"."tasks_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'OPEN'`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."tasks_status_enum_old" RENAME TO "tasks_status_enum"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "cfoId"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "requestId"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "acceptanceStatus"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_acceptancestatus_enum"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "stakeHolders"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "budget"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "expectedOutcome"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "businessObjective"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "dueDate"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "priority"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "taskType"`);
        await queryRunner.query(`ALTER TABLE "cfoRequests" DROP COLUMN "projectName"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "assignedById" uuid`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "engagementId" uuid`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "due_date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_a71800925c1bb5c31ed516effad" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_e439a1935c597dc7505e003fbe1" FOREIGN KEY ("engagementId") REFERENCES "engagements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
