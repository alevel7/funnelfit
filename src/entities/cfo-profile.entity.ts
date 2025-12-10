import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';
import {
  AvailabilityType,
  EngagementLength,
  EngagementModel,
} from 'src/common/enums/user.enum';
import { ClientRequest } from './client-request.entity';
import { Task } from './task.entity';

@Entity('cfo_profiles')
export class CFOProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: Relation<User>;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string;

  @Column({ type: 'text',nullable: true })
  aboutMe: string;

  @Column()
  role:string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resumeUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkedInUrl: string;

  // this column stores certificate name, url and cert code as json array
  @Column('jsonb', { nullable: true })
  certifications: { certCode: string; name: string; url: string }[];

  @Column({ type: 'text', nullable: true })
  education: string;

  @Column('jsonb', { nullable: true })
  expertiseAreas: { code: string; name: string }[];

  @Column('jsonb', { nullable: true })
  industries: { code: string; name: string }[];

  @Column({ type: 'jsonb', nullable: true })
  companySize: { min: number; max: number; code: string };

  @Column({ type: 'jsonb', nullable: true })
  yearsOfExperience: { min: number; max: number; code: string };

  @Column({ type: 'text', nullable: true })
  rateExpectation: string;

  @Column({ type: 'enum', enum: AvailabilityType, nullable: true })
  availabilityType: AvailabilityType;

  @Column({ type: 'text', nullable: true })
  additionalPreference: string;

  @Column({ type: 'enum', enum: EngagementLength, nullable: true })
  engagementLength: EngagementLength;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  })
  status: string;

  @Column({ type: 'enum', enum: EngagementModel, nullable: true })
  preferredEngagementModel: EngagementModel;

  // tracks all client requests made to this CFO
  
  @OneToMany(() => ClientRequest, (clientRequests) => clientRequests.cfo)
  public clientRequests: ClientRequest[];

  // @OneToMany(() => Task, (tasks) => tasks.cfo)
  // public tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
