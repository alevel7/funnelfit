import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { CreateFileUploadDto } from './dto/create-file-upload.dto';
// import { UpdateFileUploadDto } from './dto/update-file-upload.dto';
import { getSignedUrl } from '../../node_modules/@aws-sdk/s3-request-presigner/dist-es/getSignedUrl';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  getSignedUrl(@Body() createFileUploadDto: CreateFileUploadDto) {
    return this.fileUploadService.getUploadUrl(createFileUploadDto.fileKey);
  }

  // @Get()
  // findAll() {
  //   return this.fileUploadService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.fileUploadService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFileUploadDto: UpdateFileUploadDto) {
  //   return this.fileUploadService.update(+id, updateFileUploadDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.fileUploadService.remove(+id);
  // }
}
