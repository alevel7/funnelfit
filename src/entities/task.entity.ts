import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ClientRequest } from './client-request.entity';
import { CFOProfile } from './cfo-profile.entity';
import { TaskAcceptance, TaskPriority, TaskStatus } from 'src/common/enums/task.enum';
import { SMEProfile } from './sme-profile.entity';
import { CfoRequest } from './cfo-request.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Parent task (optional)
  @ManyToOne(() => Task, (task) => task.subtasks, { nullable: true, onDelete: 'CASCADE' })
  parentTask?: Task;

  // Subtasks
  @OneToMany(() => Task, (task) => task.parentTask, { cascade: true })
  subtasks?: Task[];

  @ManyToOne(() => ClientRequest, (request) => request.tasks, {
    onDelete: 'CASCADE',
  })
  public request: ClientRequest;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'int', nullable: true })
  estimatedHours: number;

  @Column()
  taskType: string;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.LOW,
  })
  priority: TaskPriority;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({type:'text'})
  businessObjective: string;

  @Column({ type: 'text' })
  expectedOutcome: string;

  // add a colun for budget allocation
  @Column({ type: 'decimal', nullable: true })
  budget: number;

  // add a column for tags
  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'simple-array', nullable: true })
  stakeHolders: string[];

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({ type: 'enum', enum: TaskAcceptance, default: TaskAcceptance.PENDING})
  acceptanceStatus: TaskAcceptance;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
