import {
  Body,
  Controller,
  Patch,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { SmeService } from './sme.service';
import { LoggedInUser } from '../common/interface/jwt.interface';
import { UpdateCompanyDto } from './dto/sme.dto';
import { SMEGuard } from 'src/auth/guards/sme.guard';

@Controller('sme')
export class SmeController {
  constructor(private smeService: SmeService) { }

  @Patch('profile')
  @UseGuards(SMEGuard)
  async updateProfile(@Request() req: any, @Body() body: UpdateCompanyDto) {
    const user: LoggedInUser = req.user;
    return this.smeService.updateProfile(user.id, body);
  }

  @Get('profile')
  @UseGuards(SMEGuard)
  async getProfile(@Request() req: any) {
    const user: LoggedInUser = req.user;
    return this.smeService.findSMEById(user.id);
  }

  @Get('cfos')
  @UseGuards(SMEGuard)
  async getCfos(@Request() req: any) {
    const user: LoggedInUser = req.user;
    return this.smeService.getSmeCfos(user.id);
  }
  @Get('cfos-stats')
  @UseGuards(SMEGuard)
  async getSmeCfosWithTaskCount(@Request() req: any) {
    const user: LoggedInUser = req.user;
    return this.smeService.getSmeCfosWithTaskCount(user.id);
  }
}
