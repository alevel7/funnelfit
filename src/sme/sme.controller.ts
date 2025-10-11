import { Body, Controller, Patch, UseGuards, Request, Get } from '@nestjs/common';
import { SmeService } from './sme.service';
import { LoggedInUser } from '../common/interface/jwt.interface';
import { UpdateCompanyDto } from './dto/sme.dto';
import { SMEGuard } from 'src/auth/guards/sme.guard';

@Controller('sme')
export class SmeController {

    constructor(private smeService: SmeService) {}

    @Patch('profile')
    @UseGuards(SMEGuard)
    updateProfile(@Request() req: any, @Body() body: UpdateCompanyDto) {
        const user: LoggedInUser = req.user
        console.log(body);
        
        return this.smeService.updateProfile(user.id, body);
    }

    @Get('profile')
    @UseGuards(SMEGuard)
    getProfile(@Request() req: any) {
        const user: LoggedInUser = req.user
        return this.smeService.findSMEById(user.id);
    }
}
