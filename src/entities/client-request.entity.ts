import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { CfoRequest } from './cfo-request.entity';
import { CFOProfile } from './cfo-profile.entity';
import { ClientRequestStatus } from 'src/common/enums/cfo-request.enum';

@Entity('clientRequests')
export class ClientRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => CfoRequest, (request) => request.cfos, { onDelete: 'CASCADE' })
    public request: CfoRequest

    @ManyToOne(() => CFOProfile, (cfo) => cfo.clientRequests, { onDelete: 'CASCADE' })
    public cfo: CFOProfile

    // add a datetime field
    @Column({ type: 'timestamp', nullable: true, default: () => null })
    scheduledMeetDate: Date;

    // add a boolean field
    @Column({ type: 'boolean', default: false })
    isRequestAccepted: boolean;

    // add a boolean field
    @Column({ type: 'boolean', default: false })
    isMeetingCompleted: boolean;

    @Column({ type: 'enum', enum: ClientRequestStatus, default: ClientRequestStatus.NEW })
    status: ClientRequestStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
