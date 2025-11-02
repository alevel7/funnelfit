import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID } from "class-validator";
import { MeetingMode } from "src/common/enums/cfo-request.enum";

export class EngagementRequestAcceptRejectDto {

    @IsBoolean()
    accept: boolean
}

export class ScheduleMeetingDto {
    @IsDateString()
    scheduledMeetDate: Date

    @IsInt()
    meetingDurationInMinutes: number

    @IsEnum(MeetingMode)
    meetingMode: MeetingMode

    @IsOptional()
    @IsString()
    additionalNotes?: string

    @IsUUID()
    clientRequestId: string
}