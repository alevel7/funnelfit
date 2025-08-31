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
    updateProfile(@Request() LoggedInUser: LoggedInUser, @Body() body: UpdateCompanyDto) {
        return this.smeService.updateProfile(LoggedInUser.id, body);
    }
}
