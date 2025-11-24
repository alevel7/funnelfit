import { Controller, Patch, Post, UseGuards, Request, Body, Param, Get, Query } from '@nestjs/common';
import { TaskboardService } from './taskboard.service';
import { SMEGuard } from 'src/auth/guards/sme.guard';
import { RolesGuard } from 'src/auth/guards/RolesGuard.guard';
import { Roles } from 'src/auth/guards/custom.decorator';
import { UserRole } from 'src/common/enums/user.enum';
import { TaskCreateDto, UpdateTaskDto } from './dto/task.dto';
import { LoggedInUser } from 'src/common/interface/jwt.interface';
import { CfoGuard } from 'src/auth/guards/cfo.guard';
import { TaskStatus } from 'src/common/enums/task.enum';

@Controller('taskboard')
export class TaskboardController {

    constructor(private taskboardService: TaskboardService) { }

    @Post('/')
    @UseGuards(SMEGuard)
    async createTask(@Request() req: any, @Body() body: TaskCreateDto,) {
        const user: LoggedInUser = req.user;
        return this.taskboardService.createTask(user, body);
    }

    @Patch('/:id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.CFO, UserRole.SME)
    async updateTask(@Param('id') taskId, @Request() req: any, @Body() body: UpdateTaskDto) {
        const user: LoggedInUser = req.user;
        return this.taskboardService.updateTask(taskId,user, body);
    }

    @Get("/sme-tasks")
    @UseGuards(SMEGuard)
    async getSMETasks(
        @Request() req: any, 
        @Query('page') page?: number, 
        @Query('limit') limit?: number,
        @Query('status') status?: TaskStatus,
        @Query('cfoId') cfoId?: string,
        @Query('search') search?: string,
    ) {
        const user: LoggedInUser = req.user;
        return this.taskboardService.getSMETasks(user, page, limit, status, cfoId, search);
    }

    @Get("/sme-tasks-statistics")
    @UseGuards(SMEGuard)
    async getSmeTaskStatistic(
        @Request() req: any,
    ) {
        const user: LoggedInUser = req.user;
        return this.taskboardService.getSmeTaskStatistic(user);
    }

    @Get("/cfo-tasks")
    @UseGuards(CfoGuard)
    async getCFOTasks(@Request() req: any,) {
        const user: LoggedInUser = req.user;
        return this.taskboardService.getCFOTasks(user);
    }

    @Post('/')
    @UseGuards(SMEGuard)
    async createSubTask(@Request() req: any, @Body() body: TaskCreateDto,) {
        const user: LoggedInUser = req.user;
        return this.taskboardService.createTask(user, body);
    }
}
