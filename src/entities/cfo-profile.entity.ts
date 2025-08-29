import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { AvailabilityType, EngagementModel } from 'src/common/enums/user.enum';

@Entity('cfo_profiles')
export class CFOProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resumeUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkedInUrl: string;

  @Column('simple-json', { array: true, nullable: true })
  certifications: {certCode:string, name:string, url:string}[];

  @Column('simple-json', { array: true, nullable: true })
  education: { degree: string; institution: string; year: number }[];

  @Column('simple-json', { array: true, nullable: true })
  expertiseAreas: { code: string, name: string }[];

  @Column('simple-json', { array: true, nullable: true })
  industries: { code: string, name: string }[];

  @Column({type: 'simple-json', nullable: true })
  companySize: { min: number; max: number };

  @Column({ type: 'simple-json', nullable: true })
  yearsOfExperience: { min: number; max: number };

  @Column({ type: 'int', nullable: true })
  rateExpectation: number;

  @Column({ type: 'enum', enum: AvailabilityType, nullable: true })
  availabilityType: AvailabilityType;

  @Column({ type: 'text', nullable: true })
  additionalPreference: string;

  @Column('simple-json', { nullable: true })
  engagementLength: { min: number; max: number, type: 'MONTHS' | 'YEARS' | 'OPEN_ENDED' | 'FLEXIBLE' };

  @Column({ type: 'enum', enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' })
  status: string;

  @Column({ type: 'enum', enum: EngagementModel, nullable: true })
  preferredEngagementModel: EngagementModel;

  @Column({ type: 'text', nullable: true })
  workExpectationsAddedNote: string;
}
