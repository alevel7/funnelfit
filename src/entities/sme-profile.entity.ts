import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('sme_profiles')
export class SMEProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  company_name: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  revenue_range: string;

  @Column({ type: 'int', nullable: true })
  num_employees: number;

  @Column('text', { array: true, nullable: true })
  financial_goals: string[];

  @Column('text', { array: true, nullable: true })
  communication_preferences: string[];

  @Column({ nullable: true })
  availability: string;

  @Column('jsonb', { nullable: true })
  key_stakeholders: any;
}
