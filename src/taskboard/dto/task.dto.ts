import { IsDateString, IsDecimal, IsEnum, IsInt, IsNumberString, IsOptional, IsString, IsUUID } from "class-validator";
import { TaskPriority, TaskStatus } from "src/common/enums/task.enum";

export class TaskCreateDto {

    @IsUUID()
    clientRequestId: string;

    @IsUUID()
    projectId: string;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    taskType: string;

    @IsEnum(TaskPriority)
    priority: TaskPriority;

    @IsDateString()
    dueDate: Date;

    @IsInt()
    estimatedHours: number;

    @IsString()
    businessObjective: string;

    @IsString()
    expectedOutcome: string;

    @IsOptional()
    @IsNumberString()
    budget?: number;

    @IsOptional()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsString({ each: true })
    stakeHolders?: string[];
}

export class UpdateTaskDto {

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    taskType: string;

    @IsEnum(TaskPriority)
    priority: TaskPriority;

    @IsDateString()
    dueDate: Date;

    @IsEnum(TaskStatus)
    status: TaskStatus

    @IsString()
    businessObjective: string;

    @IsString()
    expectedOutcome: string;

    @IsOptional()
    @IsDecimal()
    budget?: number;

    @IsOptional()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsString({ each: true })
    stakeHolders?: string[];
}