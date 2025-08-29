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

  @Column()
  companyName: string;

  @Column({type:'simple-json'})
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

  @Column({ type: 'simple-json' })
  contactPerson: {
    firstName: string;
    lastName:string;
    jobTitle:string;
    email?: string;
    phone?: string;
  };

  @Column({ type: 'simple-json', array: true, nullable: true })
  financialGoal: { code: string, name: string }[];

  @Column()
  additionalChallenges:string;

  @Column({ type: 'simple-json', array: true, nullable: true })
  areaOfNeed: { code: string, name: string }[];;

  @Column({ type: 'text', nullable: true })
  addtionalRequirement: string;

  @Column({ type: 'enum', enum: EngagementModel, nullable: true })
  preferredEngagementModel: EngagementModel;

  @Column('text', { array: true, nullable: true })
  communicationPreferences: communicationOptions[];
}
