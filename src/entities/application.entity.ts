import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: Relation<User>;

  @Column()
  status: string; // e.g., pending, approved, rejected

  @Column({ nullable: true })
  notes: string;
}
