import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Engagement } from './engagement.entity';
import { User } from './user.entity';

@Entity('time_logs')
export class TimeLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Engagement)
  engagement: Engagement;

  @ManyToOne(() => User)
  cfo: User;

  @Column({ type: 'date' })
  date: Date;

  @Column('decimal')
  hours_logged: number;

  @Column('text')
  description: string;

  @Column({ default: false })
  approved: boolean;
}
