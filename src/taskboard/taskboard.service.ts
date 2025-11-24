import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SMEProfile } from 'src/entities/sme-profile.entity';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { ProducerService } from 'src/messaging/queue/producer.service';
import { ILike, Repository } from 'typeorm';
import { TaskCreateDto, UpdateTaskDto } from './dto/task.dto';
import { LoggedInUser } from 'src/common/interface/jwt.interface';
import { ClientRequest } from 'src/entities/client-request.entity';
import { SendResponse } from 'src/common/utils/responseHandler';
import { Cache } from 'cache-manager';
import { TaskStatus } from 'src/common/enums/task.enum';
import { CFOProfile } from 'src/entities/cfo-profile.entity';

@Injectable()
export class TaskboardService {
    constructor(
        @InjectRepository(SMEProfile)private readonly smeRepo: Repository<SMEProfile>,
        @InjectRepository(CFOProfile)private readonly cfoRepo: Repository<CFOProfile>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
        @InjectRepository(ClientRequest) private readonly clientRequestRepo: Repository<ClientRequest>,
        private readonly producerService: ProducerService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    async createTask(user:LoggedInUser, data: TaskCreateDto){
        // validate that the requestId is valid
        const request = await this.clientRequestRepo.findOne({ where: { id: data.clientRequestId }});
        if(!request){
            throw new NotFoundException('Invalid request ID');
        }
        // validate that the SME profile exists
        const sme = await this.smeRepo.findOne({where:{user:{id:user.id}}});
        if(!sme){
            throw new NotFoundException('SME profile not found');
        }
        let task = this.taskRepo.create({
            request:request,
            title:data.title,
            description:data.description,
            taskType:data.taskType,
            priority:data.priority,
            dueDate:new Date(data.dueDate),
            businessObjective:data.businessObjective,
            expectedOutcome:data.expectedOutcome,
            budget:data.budget,
            tags:data.tags,
            stakeHolders: data.stakeHolders,
            estimatedHours: data.estimatedHours
        });
        await this.taskRepo.save(task);

        const createdTask = await this.getTaskById(task.id);

        return SendResponse.success(createdTask, 'Task created successfully');
    }

    async updateTask(taskId: string, user: LoggedInUser, data: UpdateTaskDto){
        let task =  await this.taskRepo.findOne({where:{id:taskId}});
        if(!task){
            throw new NotFoundException('Task not found');
        }
        // update the task fields
        Object.assign(task, data);
        await this.taskRepo.save(task);
        task = await this.getTaskById(taskId);

        return SendResponse.success(task, 'Task updated successfully');
    }

    async getTaskById(id:string) {
        const task = await this.taskRepo.findOne({
            where:{id:id},
            relations:['request', 'request.cfo'],
            select:{
                request:{
                    scheduledMeetDate:true, 
                    meetingDurationInMinutes:true, 
                    meetingMode:true, 
                    additionalNotes:true,
                    isMeetingCompleted: true,
                    rejectionReason: true,
                    status: true,
                    id:true,
                    cfo: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
        return task;
    }

    async getSMETasks(
        user: LoggedInUser,
        page: number = 1,
        limit: number = 10,
        status: TaskStatus | null = null,
        cfoId: string | null = null,
        search: string | null = null
    ) {
        // get SME profile
        const sme = await this.smeRepo.findOne({ where: { user: { id: user.id } } });
        if (!sme) {
            throw new NotFoundException('SME profile not found');
        }

        // validate that the cfoId is valid
        if (cfoId) {
            const cfo = await this.cfoRepo.findOne({ where: { id: cfoId } });
            if (!cfo) {
                throw new NotFoundException('Invalid CFO ID');
            }
        }

        // Build query using QueryBuilder for richer joins
        const qb = this.taskRepo.createQueryBuilder('task')
            .leftJoinAndSelect('task.request', 'clientRequest')
            .leftJoinAndSelect('clientRequest.cfo', 'cfo')
            .leftJoinAndSelect('clientRequest.request', 'cfoRequest')
            .where('cfoRequest.sme = :smeId', { smeId: sme.id });

        if (status) {
            qb.andWhere('task.status = :status', { status });
        }
        if (cfoId) {
            qb.andWhere('cfo.id = :cfoId', { cfoId });
        }
        if (search) {
            qb.andWhere('task.title ILIKE :search', { search: `%${search}%` });
        }

        qb.orderBy('task.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        // Select fields for task, request, and cfo
        qb.select([
            'task',
            'clientRequest.id',
            'clientRequest.scheduledMeetDate',
            'clientRequest.meetingDurationInMinutes',
            'clientRequest.meetingMode',
            'clientRequest.additionalNotes',
            'clientRequest.isMeetingCompleted',
            'clientRequest.rejectionReason',
            'clientRequest.status',
            'cfo.id',
            'cfo.firstName',
            'cfo.lastName'
        ]);

        const [tasks, total] = await qb.getManyAndCount();

        const totalPages = Math.ceil(total / limit);

        return SendResponse.success({
            tasks,
            meta: {
                page,
                totalPages,
                total,
                limit: limit
            }
        }, 'SME tasks fetched successfully');
    }
    async getCFOTasks(user: LoggedInUser){
        // fetch all tasks belonging to the CFO by their user ID
        const tasks = await this.taskRepo
            .createQueryBuilder('task')
            // .leftJoinAndSelect('task.sme', 'sme')
            .leftJoinAndSelect('task.request', 'request')
            .leftJoinAndSelect('request.cfo', 'cfo')
            // .leftJoinAndSelect('cfo.user', 'cfoUser')
            .where('cfo.id = :userId', { userId: user.id })
            .select([
                'task',
                'sme.id', 'sme.companyinfo', 'sme.user',
                'request.scheduledMeetDate',
                'request.meetingDurationInMinutes',
                'request.meetingMode',
                'request.additionalNotes',
                'request.isMeetingCompleted',
                'request.rejectionReason',
                'request.status',
                'cfo.id', 'cfo.firstName', 'cfo.lastName'
            ])
            .getMany();
        return SendResponse.success(tasks, 'CFO tasks fetched successfully');
    }

    async getSmeTaskStatistic(user: LoggedInUser) {
        const raw = await this.taskRepo
            .createQueryBuilder('t')
            .select('COUNT(*)', 'total')
            .addSelect("COUNT(*) FILTER (WHERE t.status = :completed)", 'completed')
            .addSelect("COUNT(*) FILTER (WHERE t.status = :pending)", 'pending')
            .addSelect(
                "COUNT(*) FILTER (WHERE t.status NOT IN (:...excluded))",
                'active',
            )
            .setParameters({
                completed: TaskStatus.COMPLETED,
                pending: TaskStatus.TODO,
                excluded: [
                    TaskStatus.TODO,
                    TaskStatus.COMPLETED,
                    TaskStatus.BLOCKED,
                ],
            })
            .getRawOne();

        const response =  {
            total: Number(raw.total),
            completed: Number(raw.completed),
            pending: Number(raw.pending),
            active: Number(raw.active),
        };

        return SendResponse.success(response, 'tasks fetched successfully');
        
    }
}
