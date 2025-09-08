import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { CFOProfile } from './cfo-profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'enum', enum: ['SME', 'CFO', 'ADMIN', 'REVIEWER', 'ENGAGEMENT_MANAGER'] })
  role: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isOnboarded: boolean;

  @Column({ type: 'enum', enum: ['ACTIVE', 'INACTIVE', 'PENDING'], default: 'PENDING' })
  status: string;

   // these two fields were added for reverse fetching of data and are not part of column in db
  @OneToOne(() => CFOProfile, (cfoProfile) => cfoProfile.user)
  cfo: CFOProfile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;  

}
