// import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateFileUploadDto {
    @IsString()
    @IsNotEmpty()
    fileKey: string;
}
