import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1760276639972 implements MigrationInterface {
    name = 'NewMigration1760276639972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."cfo_profiles_availabilitytype_enum" AS ENUM('weekdays', 'weekend', 'flexible')`);
        await queryRunner.query(`CREATE TYPE "public"."cfo_profiles_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED')`);
        await queryRunner.query(`CREATE TYPE "public"."cfo_profiles_preferredengagementmodel_enum" AS ENUM('CONSULTATION_PER_HOUR', 'PROJECT_BASED', 'ADVISORY_BOARD_MEMBER', 'INTERIM_CFO', 'FRACTIONAL_CFO')`);
        await queryRunner.query(`CREATE TABLE "cfo_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(100), "lastName" character varying(100), "resumeUrl" character varying(255), "linkedInUrl" character varying(255), "certifications" text, "education" text, "expertiseAreas" text, "industries" text, "companySize" text, "yearsOfExperience" text, "rateExpectation" text, "availabilityType" "public"."cfo_profiles_availabilitytype_enum", "additionalPreference" text, "engagementLength" text, "status" "public"."cfo_profiles_status_enum" NOT NULL DEFAULT 'PENDING', "preferredEngagementModel" "public"."cfo_profiles_preferredengagementmodel_enum", "userId" uuid, CONSTRAINT "REL_a1aa1865b3e7e57810a2287f28" UNIQUE ("userId"), CONSTRAINT "PK_dd5e47961a8be093f2ca0dce23e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sme_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "companyinfo" text DEFAULT '{}', "engagementDuration" text DEFAULT '{}', "contactPerson" text DEFAULT '{}', "financialGoal" text DEFAULT '[]', "additionalChallenges" text, "areaOfNeed" text DEFAULT '[]', "additionalRequirement" text, "communicationPreferences" text DEFAULT '[]', "userId" uuid, CONSTRAINT "REL_dba6254dd21e586ee1db35cf12" UNIQUE ("userId"), CONSTRAINT "PK_5e02098f085914dfc1fd7138ea8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('SME', 'CFO', 'ADMIN', 'REVIEWER', 'ENGAGEMENT_MANAGER')`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'PENDING')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying, "phoneNumber" character varying, "role" "public"."users_role_enum" NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "isOnboarded" boolean NOT NULL DEFAULT false, "status" "public"."users_status_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."engagements_status_enum" AS ENUM('ACTIVE', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TYPE "public"."engagements_retainer_tier_enum" AS ENUM('UPTO_5_HRS', 'UPTO_15_HRS', 'UPTO_25_HRS')`);
        await queryRunner.query(`CREATE TABLE "engagements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_date" date NOT NULL, "end_date" date, "status" "public"."engagements_status_enum" NOT NULL DEFAULT 'ACTIVE', "retainer_tier" "public"."engagements_retainer_tier_enum" NOT NULL, "agreement_doc_id" character varying, "sme_id" uuid, "cfo_id" uuid, CONSTRAINT "PK_aec8c95c82a37a5791001cdb9ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "time_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "hours_logged" numeric NOT NULL, "description" text NOT NULL, "approved" boolean NOT NULL DEFAULT false, "engagementId" uuid, "cfoId" uuid, CONSTRAINT "PK_8657e6aaa7035da9fc7309f385a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "nda" ("id" SERIAL NOT NULL, "signed" boolean NOT NULL, "documentUrl" character varying, "userId" uuid, CONSTRAINT "PK_2a2f3ad6a2af89b2a5425b49ea3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "due_date" date NOT NULL, "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'OPEN', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "engagementId" uuid, "assignedById" uuid, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "feedback" ("id" SERIAL NOT NULL, "rating" integer NOT NULL, "comment" character varying, "userId" uuid, "engagementId" uuid, CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "application" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "notes" character varying, "userId" uuid, CONSTRAINT "PK_569e0c3e863ebdf5f2408ee1670" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" ADD CONSTRAINT "FK_a1aa1865b3e7e57810a2287f283" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" ADD CONSTRAINT "FK_dba6254dd21e586ee1db35cf122" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "engagements" ADD CONSTRAINT "FK_a819aab3b892ce235b37f1433ac" FOREIGN KEY ("sme_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "engagements" ADD CONSTRAINT "FK_e312af350824c263a2708a0fc7f" FOREIGN KEY ("cfo_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "time_logs" ADD CONSTRAINT "FK_b89c767d03aa8b1fa2fb5da6735" FOREIGN KEY ("engagementId") REFERENCES "engagements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "time_logs" ADD CONSTRAINT "FK_419f22ceda0dc7e58aa31e07468" FOREIGN KEY ("cfoId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nda" ADD CONSTRAINT "FK_5750f8944de11272d397cf901bd" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_e439a1935c597dc7505e003fbe1" FOREIGN KEY ("engagementId") REFERENCES "engagements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_a71800925c1bb5c31ed516effad" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_4a39e6ac0cecdf18307a365cf3c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_a5f7696eb78ccfaeba3ef6301fe" FOREIGN KEY ("engagementId") REFERENCES "engagements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application" ADD CONSTRAINT "FK_b4ae3fea4a24b4be1a86dacf8a2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "application" DROP CONSTRAINT "FK_b4ae3fea4a24b4be1a86dacf8a2"`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_a5f7696eb78ccfaeba3ef6301fe"`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_4a39e6ac0cecdf18307a365cf3c"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_a71800925c1bb5c31ed516effad"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_e439a1935c597dc7505e003fbe1"`);
        await queryRunner.query(`ALTER TABLE "nda" DROP CONSTRAINT "FK_5750f8944de11272d397cf901bd"`);
        await queryRunner.query(`ALTER TABLE "time_logs" DROP CONSTRAINT "FK_419f22ceda0dc7e58aa31e07468"`);
        await queryRunner.query(`ALTER TABLE "time_logs" DROP CONSTRAINT "FK_b89c767d03aa8b1fa2fb5da6735"`);
        await queryRunner.query(`ALTER TABLE "engagements" DROP CONSTRAINT "FK_e312af350824c263a2708a0fc7f"`);
        await queryRunner.query(`ALTER TABLE "engagements" DROP CONSTRAINT "FK_a819aab3b892ce235b37f1433ac"`);
        await queryRunner.query(`ALTER TABLE "sme_profiles" DROP CONSTRAINT "FK_dba6254dd21e586ee1db35cf122"`);
        await queryRunner.query(`ALTER TABLE "cfo_profiles" DROP CONSTRAINT "FK_a1aa1865b3e7e57810a2287f283"`);
        await queryRunner.query(`DROP TABLE "application"`);
        await queryRunner.query(`DROP TABLE "feedback"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
        await queryRunner.query(`DROP TABLE "nda"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "time_logs"`);
        await queryRunner.query(`DROP TABLE "engagements"`);
        await queryRunner.query(`DROP TYPE "public"."engagements_retainer_tier_enum"`);
        await queryRunner.query(`DROP TYPE "public"."engagements_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "sme_profiles"`);
        await queryRunner.query(`DROP TABLE "cfo_profiles"`);
        await queryRunner.query(`DROP TYPE "public"."cfo_profiles_preferredengagementmodel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."cfo_profiles_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."cfo_profiles_availabilitytype_enum"`);
    }

}
