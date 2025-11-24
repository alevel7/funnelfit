import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { EngagementModel } from 'src/common/enums/user.enum';
import { CfoRequest } from './cfo-request.entity';
import { Task } from './task.entity';
import { ClientRequest } from './client-request.entity';

type communicationOptions = 'email' | 'phone' | 'call' | 'in-person';

@Entity('sme_profiles')
export class SMEProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  companyinfo: {
    companyName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    industry: { code: string; name: string };
    revenue: { min: number; max: number; code: string };
    employees: { min: number; max: number; code: string };
    yearsInBusiness: { min: number; max: number; code: string };
  };

  @Column({ type: 'jsonb', nullable: true, default: {} }) // e.g. 6 months, 1 year, 2 years
  engagementDuration: {
    min: number;
    max: number;
    code: string;
  };

  @Column({ type: 'jsonb', nullable: true, default: {} })
  contactPerson: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    email?: string;
    phoneNumber?: string;
  };

  @Column({ type: 'jsonb', nullable: true, default: [] })
  financialGoal: { code: string; name: string }[];

  @Column({ type: 'text', nullable: true })
  additionalChallenges: string;

  @Column({ type: 'jsonb', nullable: true, default: [] })
  areaOfNeed: { code: string; name: string }[];

  @Column({ type: 'text', nullable: true, default: null })
  additionalRequirement: string;

  @Column('simple-array', { nullable: true, default: [] })
  communicationPreferences: communicationOptions[];

  // tracks sme initial cfo requests criteria
  @OneToMany(() => CfoRequest, (requests) => requests.sme)
  cfoRequests: CfoRequest[];

  // @OneToMany(() => ClientRequest, (clientRequest) => clientRequest.sme)
  // clientRequests: ClientRequest[];

  // @OneToMany(() => Task, (requests) => requests.sme)
  // tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
