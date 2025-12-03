import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  CfoUrgencyLevel,
  companySizeExperience,
  EngagementModel,
} from 'src/common/enums/user.enum';
import { ClientRequest } from './client-request.entity';
import { SMEProfile } from './sme-profile.entity';

@Entity('cfoRequests')
export class CfoRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb', nullable: true })
  financialChallenge: { code: string; name: string };

  @Column({ type: 'enum', enum: CfoUrgencyLevel })
  urgencyLevel: CfoUrgencyLevel;

  @Column({type: 'varchar', length: 255, nullable: true})
  projectName: string;

  @Column({ type: 'enum', enum: EngagementModel })
  serviceType: EngagementModel;

  @Column({ type: 'enum', enum: companySizeExperience })
  cfoExperience: companySizeExperience;

  @Column({ type: 'text', nullable: true })
  otherRequirements: string;

  @ManyToOne(() => SMEProfile, (user) => user.cfoRequests, {
    onDelete: 'CASCADE',
  })
  sme: SMEProfile;

  // tracks which CFOs have been requested for this particular request
  @OneToMany(() => ClientRequest, (clientRequests) => clientRequests.request)
  public cfos: ClientRequest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
