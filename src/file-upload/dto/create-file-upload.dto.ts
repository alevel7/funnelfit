import { IsNotEmpty, IsString } from "class-validator";

export class CreateFileUploadDto {

    @IsString()
    @IsNotEmpty()
    fileKey: string;
}
