import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'enum', enum: ['SME', 'CFO', 'ADMIN', 'REVIEWER', 'ENGAGEMENT_MANAGER'] })
  role: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'enum', enum: ['ACTIVE', 'INACTIVE', 'PENDING'], default: 'PENDING' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  // @BeforeInsert()
  // @BeforeUpdate()
  // async validate() {
  //   await validateOrReject(this);
  // }
}
