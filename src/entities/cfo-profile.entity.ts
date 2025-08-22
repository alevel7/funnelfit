import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

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


  @Column({ type: 'text', nullable: true })
  pastProject: string;

  @Column('text', { array: true, nullable: true })
  certifications: string[];

  @Column('text', { array: true, nullable: true })
  otherCertifications: string[];

  @Column('text', { array: true, nullable: true })
  expertise_areas: string[];

  @Column('text', { array: true, nullable: true })
  industries: string[];

  @Column('text', { array: true, nullable: true })
  software_skills: string[];

  @Column({ type: 'int', nullable: true })
  years_experience: number;

  @Column({ type: 'int', nullable: true })
  hourlyRate: number;

  @Column({ type: 'enum', enum: ['LESS_THAN_8', '8_TO_15', '15_TO_24'], nullable: true })
  availabilityHoursRange: string;

  @Column({ type: 'enum', enum: ['LESS_THAN_8', '8_TO_15', '15_TO_24'], nullable: true })
  workingHours: string;

  @Column('text', { array: true, nullable: true })
  engagement_type: string[];

  @Column({ type: 'enum', enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' })
  status: string;

  @Column('text', { array: true, nullable: true })
  preferredPricingModel: (
    | 'PER_HOUR'
    | 'PROJECT_BASED'
    | 'RETAINER_BASED'
    | 'MONTHLY_FIXED_FEE'
    | 'PERFORMANCE_BASED'
  )[];

  @Column({ type: 'text', nullable: true })
  workExpectationsAddedNote: string;
}
