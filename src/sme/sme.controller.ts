import { Body, Controller, Patch, UseGuards, Request, Get, Post, Param, Query, ParseIntPipe } from '@nestjs/common';
import { SmeService } from './sme.service';
import { LoggedInUser } from '../common/interface/jwt.interface';
import { CfoRequestDto, UpdateCompanyDto } from './dto/sme.dto';
import { SMEGuard } from 'src/auth/guards/sme.guard';
import { ClientRequestDto } from './dto/cfoRequest.dto';

@Controller('sme')
export class SmeController {

    constructor(private smeService: SmeService) {}

    @Patch('profile')
    @UseGuards(SMEGuard)
    async updateProfile(@Request() req: any, @Body() body: UpdateCompanyDto) {
        const user: LoggedInUser = req.user
        return this.smeService.updateProfile(user.id, body);
    }

    @Get('profile')
    @UseGuards(SMEGuard)
    async getProfile(@Request() req: any) {
        const user: LoggedInUser = req.user
        return this.smeService.findSMEById(user.id);
    }

    @Post('cfo-request')
    @UseGuards(SMEGuard)
    async requestCFO(@Body() body: CfoRequestDto, @Request() req: any,) {
        const user: LoggedInUser = req.user
        return this.smeService.requestCFO(body, user);
    }

    @Get('cfo-requests')
    @UseGuards(SMEGuard)
    async getCFORequests(@Request() req: any) {
        const user: LoggedInUser = req.user
        return this.smeService.getCFORequests(user.id);
    }

    @Get('cfo-requests/:requestId/')
    @UseGuards(SMEGuard)
    async getCFORequestResult(
        @Request() req: any, 
        @Param('requestId') requestId: string,
        @Query('page', ParseIntPipe) page: number,
    ) {
        const user: LoggedInUser = req.user
        return this.smeService.getCFORequestResult(requestId, page);
    }

    @Post('cfo-requests/:requestId/cfo-select')
    @UseGuards(SMEGuard)
    async selectCFOForRequest(
        @Request() req: any, 
        @Param('requestId') requestId: string,
        @Body() body: ClientRequestDto,
    ) {
        const user: LoggedInUser = req.user
        return this.smeService.sendRequestToCfo(requestId, body);
    }
}
