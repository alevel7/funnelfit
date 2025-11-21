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
        const request = await this.clientRequestRepo.findOne({where:{id:data.requestId}});
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
            cfo:{id:request.cfoId},
            sme:{id:sme.id},
            title:data.title,
            description:data.description,
            taskType:data.taskType,
            priority:data.priority,
            dueDate:new Date(data.dueDate),
            businessObjective:data.businessObjective,
            expectedOutcome:data.expectedOutcome,
            budget:data.budget,
            tags:data.tags,
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
            relations:['cfo','request'],
            select:{
                cfo:{
                    id: true, firstName: true, lastName: true,
                },
                request:{
                    scheduledMeetDate:true, 
                    meetingDurationInMinutes:true, 
                    meetingMode:true, 
                    isRequestAccepted:true,
                    additionalNotes:true,
                    isMeetingCompleted: true,
                    rejectionReason: true,
                    status: true
                }
            }
        });
        return task;
    }

    async getSMETasks(user: LoggedInUser, page:number=1, limit:number=10, status:TaskStatus | null=null, cfoId:string | null=null, search:string | null=null){
        // get SME profile
        const sme = await this.smeRepo.findOne({where:{user:{id:user.id}}});
        if(!sme){
            throw new NotFoundException('SME profile not found');
        }

        // validate that the cfoId is valid
        if(cfoId){
            const cfo = await this.cfoRepo.findOne({where:{id:cfoId}});
            if(!cfo){
                throw new NotFoundException('Invalid CFO ID');
            }
        }

        
        // build where condition
        const whereCondition: any = {sme:{id:sme.id}};
        if(status){
            whereCondition.status = status;
        }
        if (cfoId) {
            whereCondition.cfo = { id: cfoId };
        }

        // search by title
        if (search) {
            whereCondition.title = ILike(`%${search}%`);
        }
        
        // fetch all tasks created by this sme with pagination
        const [tasks, total] = await this.taskRepo.findAndCount({
            where: whereCondition,
            relations:['cfo','request'],
            // order: { createdAt: 'DESC' },
            select:{
                cfo:{
                    id: true, firstName: true, lastName: true,
                },
                request:{
                    scheduledMeetDate:true, 
                    meetingDurationInMinutes:true, 
                    meetingMode:true, 
                    isRequestAccepted:true,
                    additionalNotes:true,
                    isMeetingCompleted: true,
                    rejectionReason: true,
                    status: true
                }
            },
            skip: (page - 1) * limit,
            take: limit
        });
        
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
        // fetch all tasks assigned to this cfo
        const tasks = await this.taskRepo.find({
            where:{cfo:{user:{id:user.id}}},
            relations:['sme','request'],
            select:{
                sme:{
                    id: true, companyinfo: true, user: true,
                },
                request:{
                    scheduledMeetDate:true, 
                    meetingDurationInMinutes:true, 
                    meetingMode:true, 
                    isRequestAccepted:true,
                    additionalNotes:true,
                    isMeetingCompleted: true,
                    rejectionReason: true,
                    status: true
                }
            }
        });
        return SendResponse.success(tasks, 'CFO tasks fetched successfully');
    }
}
