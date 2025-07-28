import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('cfo_profiles')
export class CFOProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column('text', { array: true, nullable: true })
  certifications: string[];

  @Column('text', { array: true, nullable: true })
  expertise_areas: string[];

  @Column('text', { array: true, nullable: true })
  industries: string[];

  @Column('text', { array: true, nullable: true })
  software_skills: string[];

  @Column({ type: 'int', nullable: true })
  years_experience: number;

  @Column({ type: 'enum', enum: ['LESS_THAN_5', '5_TO_15', '15_TO_40'], nullable: true })
  availability_hours_range: string;

  @Column('text', { array: true, nullable: true })
  engagement_type: string[];

  @Column({ type: 'enum', enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' })
  status: string;
}
