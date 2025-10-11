import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { AvailabilityType, EngagementModel } from 'src/common/enums/user.enum';

@Entity('cfo_profiles')
export class CFOProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string;

  // @Column({ type: 'varchar', length: 20, nullable: true })
  // phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resumeUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkedInUrl: string;

  // For an array of objects, use 'simple-json' (not array:true)
  @Column('simple-json', { nullable: true })
  certifications: { certCode: string; name: string; url: string }[];

  @Column({ type: 'text', nullable: true })
  education: string;

  @Column('simple-json', { nullable: true })
  expertiseAreas: { code: string, name: string }[];

  @Column('simple-json', { nullable: true })
  industries: { code: string, name: string }[];

  @Column({type: 'simple-json', nullable: true })
  companySize: { min: number; max: number, code:string };

  @Column({ type: 'simple-json', nullable: true })
  yearsOfExperience: { min: number; max: number, code: string };

  @Column({ type: 'text', nullable: true })
  rateExpectation: string;

  @Column({ type: 'enum', enum: AvailabilityType, nullable: true })
  availabilityType: AvailabilityType;

  @Column({ type: 'text', nullable: true })
  additionalPreference: string;

  @Column({ type: 'text', nullable: true })
  engagementLength: string;

  @Column({ type: 'enum', enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' })
  status: string;

  @Column({ type: 'enum', enum: EngagementModel, nullable: true })
  preferredEngagementModel: EngagementModel;

  // @Column({ type: 'text', nullable: true })
  // workExpectationsAddedNote: string;
}
