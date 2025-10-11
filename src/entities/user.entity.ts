import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { CFOProfile } from './cfo-profile.entity';
import { SMEProfile } from './sme-profile.entity';
import { LoginType } from 'src/auth/dto/login.dto';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'enum', enum: ['SME', 'CFO', 'ADMIN', 'REVIEWER', 'ENGAGEMENT_MANAGER'] })
  role: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isOnboarded: boolean;

  @Column({ type: 'enum', enum: ['ACTIVE', 'INACTIVE', 'PENDING'], default: 'PENDING' })
  status: string;

  // @Column({ nullable: true, default: LoginType.STANDARD })
  // loginType: LoginType;

   // these two fields were added for reverse fetching of data and are not part of column in db
  @OneToOne(() => CFOProfile, (cfoProfile) => cfoProfile.user)
  cfo: CFOProfile;

  @OneToOne(() => SMEProfile, (smeProfile) => smeProfile.user)
  sme: SMEProfile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;  

}
