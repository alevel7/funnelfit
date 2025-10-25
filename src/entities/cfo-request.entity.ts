import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CfoUrgencyLevel, companySizeExperience, EngagementModel } from 'src/common/enums/user.enum';
import { IsString } from 'class-validator';

@Entity('cfoRequests')
export class CfoRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'simple-json', nullable: true })
    financialChallenge: { code: string, name: string };

    @Column({ type: 'enum', enum: CfoUrgencyLevel })
    urgencyLevel: CfoUrgencyLevel;

    @IsString()
    engagementTime: string;

    @Column({ type: 'enum', enum: EngagementModel })
    serviceType: EngagementModel;

    @Column({ type: 'enum', enum: companySizeExperience })
    cfoExperience: companySizeExperience;

    @Column({ type: 'text', nullable: true })
    otherRequirements: string
}
