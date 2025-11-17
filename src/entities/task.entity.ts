import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Engagement } from './engagement.entity';
import { User } from './user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Engagement)
  engagement: Engagement;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'date' })
  due_date: Date;

  @Column({
    type: 'enum',
    enum: ['OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED'],
    default: 'OPEN',
  })
  status: string;

  @ManyToOne(() => User)
  assigned_by: User;

  @Column({ type: 'timestamp', default: () => 'now()' })
  created_at: Date;
}
