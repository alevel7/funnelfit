import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Engagement } from './engagement.entity';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Engagement)
  engagement: Engagement;

  @Column()
  rating: number;

  @Column({ nullable: true })
  comment: string;
}
