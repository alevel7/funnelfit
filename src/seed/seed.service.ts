import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CFOProfile } from 'src/entities/cfo-profile.entity';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';
import { AvailabilityType, EngagementLength, EngagementModel } from 'src/common/enums/user.enum';

@Injectable()
export class SeedService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(CFOProfile)
        private readonly cfoRepo: Repository<CFOProfile>,
        private readonly dataSource: DataSource,
    ) { }


    // method to seed 100 new cfo
    async seedUsers() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const users: User[] = [];
            const cfoProfiles: CFOProfile[] = [];
            // const roles = ['SME', 'CFO', 'ADMIN', 'REVIEWER', 'ENGAGEMENT_MANAGER'];
            const statuses = ['ACTIVE', 'INACTIVE', 'PENDING'];


            const industries = [
                { name: 'Technology', code: 'technology' },
                { name: 'Healthcare', code: 'healthcare' },
                { name: 'Finance', code: 'finance' },
                { name: 'Education', code: 'education' },
                { name: 'Retail', code: 'retail' },
                { name: 'Manufacturing', code: 'manufacturing' },
                { name: 'Consulting', code: 'consulting' },
                { name: 'Saas', code: 'saas' },
                { name: 'Treasury Management', code: 'treasury_management' },
            ]

            const areaOfExpertise = [
                { name: 'Financial Planning & budgeting', code: 'financial_planning_budgeting' },
                { name: 'Cash Flow Management', code: 'cash_flow_management' },
                { name: 'Financial reporting & analysis', code: 'financial_reporting_analysis' },
                { name: 'Fundraising & capital raising', code: 'fundraising_capital_raising' },
                { name: 'Cost optimization', code: 'cost_optimization' },
                { name: 'Tax planning & compliance', code: 'tax_planning_compliance' },
                { name: 'M&A financial due diligence', code: 'ma_financial_due_diligence' },
                { name: 'Investor relations', code: 'investor_relations' },
                { name: 'Risk management', code: 'risk_management' },
                { name: 'IPO preparation', code: 'ipo_preparation' },
                { name: 'Financial modeling', code: 'financial_modeling' },
                { name: 'Treasury management', code: 'treasury_management' },
                { name: 'Audit & compliance', code: 'audit_compliance' },
            ]

            const certifications = [
                { name: 'CPA (Certified Public Accountant)', code: 'CPA' },
                { name: 'CMA (Certified Management Accountant)', code: 'CMA' },
                { name: 'CFA (Chartered Financial Analyst)', code: 'CFA' },
                { name: 'ACCA (Association of Chartered Certified Accountants)', code: 'ACCA' },
                { name: 'CIA (Certified Internal Auditor)', code: 'CIA' },
                { name: 'FRM (Financial Risk Manager)', code: 'FRM' },
                { name: 'PMP (Project Management Professional)', code: 'PMP' }
            ]
            const companySize = [
                { code: 'startup', min: 1, max: 10 },
                { code: 'small_business', min: 11, max: 50 },
                { code: 'medium_business', min: 51, max: 200 },
                { code: 'large_business', min: 201, max: 1000 },
                { code: 'enterprise', min: 1001, max: Infinity }
            ]
            const yearsOfExperience = [
                { code: '1-3', min: 1, max: 3 },
                { code: '3-5', min: 3, max: 5 },
                { code: '5-10', min: 5, max: 10 },
                { code: '10-15', min: 10, max: 15 },
                { code: '15-20', min: 15, max: 20 }
            ]

            for (let i = 0; i < 100; i++) {
                const firstName = faker.name.firstName();
                const lastName = faker.name.lastName();
                const domain = faker.helpers.arrayElement(['gmail.com', 'yahoo.com', 'company.com']);

                const user = queryRunner.manager.create(User, {
                    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
                    password: await bcrypt.hash('password123', 10),
                    phoneNumber: faker.phone.phoneNumber("+234##########"),
                    role: 'CFO',
                    isVerified: faker.datatype.boolean(),
                    isOnboarded: faker.datatype.boolean(),
                    status: 'ACTIVE',
                });

                users.push(user);

                // Create CFO profile only for CFO users
                const cfoProfile = queryRunner.manager.create(CFOProfile, {
                    user: user, // This will be linked after user is saved
                    firstName,
                    lastName,
                    resumeUrl: faker.internet.url(),
                    linkedInUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
                    certifications: faker.helpers.arrayElements(certifications, 3),
                    education: faker.helpers.arrayElement([
                        'MBA in Finance',
                        'Bachelor in Accounting',
                        'Master in Business Administration',
                        'Bachelor in Economics',
                        'Master in Finance'
                    ]),
                    expertiseAreas: faker.helpers.arrayElements(areaOfExpertise, 4),
                    industries: faker.helpers.arrayElements(industries, 3),
                    companySize: faker.helpers.arrayElements(companySize, 1)[0],
                    yearsOfExperience: faker.helpers.arrayElements(yearsOfExperience, 1)[0],
                    rateExpectation: faker.helpers.arrayElement([
                        '$50-100/hour',
                        '$100-150/hour',
                        '$150-200/hour',
                        '$200+/hour'
                    ]),
                    availabilityType: faker.helpers.objectValue(AvailabilityType),
                    additionalPreference: faker.lorem.sentence(),
                    engagementLength: faker.helpers.objectValue(EngagementLength),
                    status: 'APPROVED',
                    preferredEngagementModel: faker.helpers.objectValue(EngagementModel),
                });

                cfoProfiles.push(cfoProfile);
            }

            // Save users first
            console.log('💾 Saving users...');
            const savedUsers = await queryRunner.manager.save(User, users, { chunk: 20 });
            console.log('✅ Successfully saved 100 users');

            // Update CFO profiles with saved user references and save
            if (cfoProfiles.length > 0) {
                // Link CFO profiles to their corresponding saved users
                const cfoUsers = savedUsers.filter(user => user.role === 'CFO');

                cfoProfiles.forEach((profile, index) => {
                    profile.user = cfoUsers[index];
                });

                await queryRunner.manager.save(CFOProfile, cfoProfiles, { chunk: 10 });
                console.log(`✅ Successfully seeded ${cfoProfiles.length} CFO profiles`);
            }
            // Commit the transaction
            await queryRunner.commitTransaction();
            console.log('🎉 Seeding completed successfully - all changes committed');
        } catch (error) {
            // Rollback the transaction on error
            console.error('❌ Error during seeding:', error);
            await queryRunner.rollbackTransaction();
            console.log('🔄 Transaction rolled back - no changes were made to the database');
            throw error; // Re-throw the error for the caller to handle
        } finally {
            // Release the query runner
            await queryRunner.release();
        }
    }

    async clear(): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            console.log('🗑️ Clearing database...');

            // Delete in correct order due to foreign key constraints
            await queryRunner.manager.delete(CFOProfile, {});
            await queryRunner.manager.delete(User, {});

            await queryRunner.commitTransaction();
            console.log('✅ Database cleared successfully');

        } catch (error) {
            console.error('❌ Error during clearing:', error);
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

}
