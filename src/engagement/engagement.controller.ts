import { Body, Controller, DefaultValuePipe, Get, Post, Query, UseGuards, Request, ParseIntPipe, Param } from '@nestjs/common';
import { EngagementService } from './engagement.service';
import { SMEGuard } from 'src/auth/guards/sme.guard';
import { LoggedInUser } from 'src/common/interface/jwt.interface';
import { CfoRequestDto, ClientRequestDto } from './dto/cfoRequest.dto';

@Controller('engagements')
export class EngagementController {
    constructor(private engagementService: EngagementService) { }

    @Post('cfo-request')
    @UseGuards(SMEGuard)
    async requestCFO(@Body() body: CfoRequestDto, @Request() req: any) {
        const user: LoggedInUser = req.user;
        return this.engagementService.requestCFO(body, user);
    }

    @Get('cfo-requests')
    @UseGuards(SMEGuard)
    async getCFORequests(
        @Request() req: any,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
    ) {
        const user: LoggedInUser = req.user;
        return this.engagementService.getCFORequests(user.id, page, limit);
    }

    @Get('cfo-requests/:requestId/matches')
    @UseGuards(SMEGuard)
    async getCFORequestResult(
        @Request() req: any,
        @Param('requestId') requestId: string,
        @Query('page', ParseIntPipe) page: number,
    ) {
        const user: LoggedInUser = req.user;
        return this.engagementService.getCFORequestResult(requestId, page);
    }

    @Post('cfo-requests/:requestId/cfo-select')
    @UseGuards(SMEGuard)
    async selectCFOForRequest(
        @Request() req: any,
        @Param('requestId') requestId: string,
        @Body() body: ClientRequestDto,
    ) {
        const user: LoggedInUser = req.user;
        return this.engagementService.sendRequestToCfo(requestId, body, user);
    }

    @Get('cfo-requests/:requestId/selected-cfo')
    @UseGuards(SMEGuard)
    async getAllRequestSelectedCfo(
        @Request() req: any,
        @Param('requestId') requestId: string,
    ) {
        const sme: LoggedInUser = req.user;
        return this.engagementService.getAllRequestSelectedCfo(requestId, sme);
    }

    @Get('engagements')
    @UseGuards(SMEGuard)
    async getEngagements(
        @Request() req: any,
    ) {
        const sme: LoggedInUser = req.user;
        return this.engagementService.getEngagements(sme);
    }

    @Get('/:id')
    @UseGuards(SMEGuard)
    async getEngagementByProject(
        @Request() req: any,
        @Param('projectId') projectId: string,
    ) {
        const sme: LoggedInUser = req.user;
        return this.engagementService.getEngagementDetail(projectId, sme);
    }
}
