import { IsDateString, IsDecimal, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { TaskPriority, TaskStatus } from "src/common/enums/task.enum";

export class TaskCreateDto {

    @IsUUID()
    requestId: string;

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