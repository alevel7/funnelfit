import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { EngagementModel } from 'src/common/enums/user.enum';

type communicationOptions = 'email' | 'phone' | 'call' | 'in-person';

@Entity('sme_profiles')
export class SMEProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  companyName: string;

  @Column({ type: 'simple-json', nullable: true, default: {} })
  companyinfo: {
      companyName: string;
      address: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      industry: string;
      revenue: {min:number, max:number, code:string}
      employees: { min: number, max: number, code: string }
      yearsInBusiness: { min: number, max: number, code: string }
  };

  @Column({ type: 'simple-json', nullable: true, default: {} })
  contactPerson: {
    firstName: string;
    lastName:string;
    jobTitle:string;
    email?: string;
    phone?: string;
  };

  @Column({ type: 'simple-json', array: true, nullable: true, default: [] })
  financialGoal: { code: string, name: string }[];

  @Column({ type: 'text', nullable: true })
  additionalChallenges:string;

  @Column({ type: 'simple-json', array: true, nullable: true, default: [] })
  areaOfNeed: { code: string, name: string }[];

  @Column({ type: 'text', nullable: true, default: null })
  addtionalRequirement: string;

  @Column({ type: 'enum', enum: EngagementModel, nullable: true, default: null })
  preferredEngagementModel: EngagementModel;

  @Column('text', { array: true, nullable: true, default: [] })
  communicationPreferences: communicationOptions[];
}
