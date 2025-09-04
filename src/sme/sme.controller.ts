import { Body, Controller, Patch, UseGuards, Request } from '@nestjs/common';
import { SMEGuard } from 'src/common/guards/sme.guard';
import { SmeService } from './sme.service';
import { LoggedInUser } from '../common/interface/jwt.interface';
import { UpdateCompanyDto } from './dto/sme.dto';

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
}
