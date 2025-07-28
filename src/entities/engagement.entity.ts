import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('engagements')
export class Engagement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sme_id' })
  sme: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'cfo_id' })
  cfo: User;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ type: 'enum', enum: ['ACTIVE', 'COMPLETED', 'CANCELLED'], default: 'ACTIVE' })
  status: string;

  @Column({ type: 'enum', enum: ['UPTO_5_HRS', 'UPTO_15_HRS', 'UPTO_25_HRS'] })
  retainer_tier: string;

  @Column({ nullable: true })
  agreement_doc_id: string;
}
