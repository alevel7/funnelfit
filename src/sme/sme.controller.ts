import { Body, Controller, Patch, UseGuards, Request, Get, Post } from '@nestjs/common';
import { SmeService } from './sme.service';
import { LoggedInUser } from '../common/interface/jwt.interface';
import { CfoRequestDto, UpdateCompanyDto } from './dto/sme.dto';
import { SMEGuard } from 'src/auth/guards/sme.guard';

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
    async requestCFO(@Body() body: CfoRequestDto) {
        return this.smeService.requestCFO(body);
    }
}
