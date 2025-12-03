import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CfoRequest } from './cfo-request.entity';
import { CFOProfile } from './cfo-profile.entity';
import {
  ClientRequestStatus,
  MeetingMode,
} from 'src/common/enums/cfo-request.enum';
import { Task } from './task.entity';

@Entity('clientRequests')
export class ClientRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CfoRequest, (request) => request.cfos, {
    onDelete: 'CASCADE',
  })
  public request: CfoRequest;

  @ManyToOne(() => CFOProfile, (cfo) => cfo.clientRequests, {
    onDelete: 'CASCADE',
  })
  public cfo: CFOProfile;


  @OneToMany(() => Task, (tasks) => tasks.request)
  public tasks: Task[];
  

  @Column()
  cfoId: string;

  // add a datetime field to track date and time for meeting
  @Column({ type: 'timestamp', nullable: true })
  scheduledMeetDate: string;

  // add integer column to track duration of meeting in minutes
  @Column({ type: 'int', nullable: true, default: null })
  meetingDurationInMinutes: number;

  // add an enum field to track mode of meeting: IN_PERSONN or PHONE_CALL or VIDEO_CALL
  @Column({ type: 'enum', enum: MeetingMode, nullable: true })
  meetingMode: MeetingMode;

  // add a string field for optional notes
  @Column({ type: 'text', nullable: true })
  additionalNotes: string;

  // add a boolean field
  @Column({ type: 'boolean', default: false })
  isMeetingCompleted: boolean;

  // reason for rejection
  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({
    type: 'enum',
    enum: ClientRequestStatus,
    default: ClientRequestStatus.NEW,
  })
  status: ClientRequestStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
