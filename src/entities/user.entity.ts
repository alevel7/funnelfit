import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ type: 'enum', enum: ['SME', 'CFO', 'ADMIN', 'REVIEWER', 'ENGAGEMENT_MANAGER'] })
  role: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ type: 'enum', enum: ['ACTIVE', 'INACTIVE', 'PENDING'], default: 'PENDING' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
