import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { MeetingMode } from 'src/common/enums/cfo-request.enum';
import { ClientRequestStatus } from 'src/common/enums/cfo-request.enum';
export class ClientRequestUpdateDto {

  @IsOptional()
  @IsDateString()
  scheduledMeetDate: string;

  @IsOptional()
  @IsInt()
  meetingDurationInMinutes: number;

  @IsOptional()
  @IsBoolean()
  isMeetingCompleted: boolean;

  @IsOptional()
  @IsString()
  additionalNotes: string;

  @IsOptional()
  @IsBoolean()
  isRequestAccepted: boolean;

  @IsOptional()
  @IsEnum(MeetingMode)
  meetingMode: MeetingMode;

  @IsOptional()
  @IsEnum(ClientRequestStatus)
  status: ClientRequestStatus

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.status === ClientRequestStatus.DECLINED)
  rejectionReason: string;
}

export class ScheduleMeetingDto {
  @IsDateString()
  scheduledMeetDate: string;

  @IsInt()
  meetingDurationInMinutes: number;

  @IsEnum(MeetingMode)
  meetingMode: MeetingMode;

  @IsOptional()
  @IsString()
  additionalNotes?: string;
}
