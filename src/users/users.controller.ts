import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateCFODto } from './dto/update-user.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { CfoGuard } from 'src/auth/guards/cfo.guard';
import { RolesGuard } from 'src/auth/guards/RolesGuard.guard';
import { Roles } from 'src/auth/guards/custom.decorator';
import { UserRole } from 'src/common/enums/user.enum';
import { LoggedInUser } from 'src/common/interface/jwt.interface';
import { ClientRequestStatus } from 'src/common/enums/cfo-request.enum';
import {
  ClientRequestUpdateDto,
  ScheduleMeetingDto,
} from './dto/engagment-requests.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: RegisterDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(CfoGuard)
  @Get('engagement-requests')
  getEngagementRequests(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('status') status: ClientRequestStatus,
    @Request() req: any,
  ) {
    const user: LoggedInUser = req.user;
    return this.usersService.getEngagementRequests(page, limit, status, user);
  }

  @UseGuards(CfoGuard)
  @Post('engagement-requests/:id/schedule-meeting')
  scheduleMeeting(
    @Param('id') id: string,
    @Body() body: ScheduleMeetingDto,
    @Request() req: any,
  ) {
    const user: LoggedInUser = req.user;
    return this.usersService.scheduleMeeting(id, body, user);
  }

  @UseGuards(CfoGuard)
  @Put('engagement-requests/:id')
  updateEngagementRequests(
    @Param('id') id: string,
    @Body() body: ClientRequestUpdateDto,
    @Request() req: any,
  ) {
    const user: LoggedInUser = req.user;
    return this.usersService.updateEngagementRequests(id, body, user);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.CFO, UserRole.SME)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(CfoGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateCFODto) {
    return this.usersService.update(id, updateUserDto);
  }
}
