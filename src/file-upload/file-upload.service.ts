import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { lookup } from 'mime-types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploadService {
  private readonly s3: S3Client;
  private readonly bucketName:string;

  constructor( private readonly configService: ConfigService,) {
    this.s3 = new S3Client({
      endpoint: this.configService.getOrThrow('R2_BUCKET_PATH'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('R2_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('R2_SECRET_ACCESS_KEY'),
      },
      region: 'auto',
    });
    this.bucketName = this.configService.getOrThrow('R2_BUCKET_NAME');
  }

  /**
   * Generate a pre-signed URL for uploading an image
   */
  async getUploadUrl(fileKey: string): Promise<{ signedUrl:string, url:string }> {
    const fileExt = path.extname(fileKey);
    const fileName =
      fileKey.replace(fileExt, '').toLowerCase().split(' ').join('-') +
      Date.now() +
      fileExt;
    const contentType = lookup(fileExt) || 'application/octet-stream';

    // Generate the PutObjectCommand for the file
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      ContentType: contentType,
    });

    // Generate and return the pre-signed URL
    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    const url = `${this.configService.getOrThrow('R2_BUCKET_PATH')}/${fileName}`
    return { signedUrl, url};
  }

  /**
   * Generate a pre-signed URL for fetching an image
   */
  async getDownloadUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    return await getSignedUrl(this.s3, command, { expiresIn: 3600 });
  }

  /**
   * Generate a pre-signed URL for deleting an image
   */
  async getDeleteUrl(fileKey: string): Promise<string> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    return await getSignedUrl(this.s3, command);
  }
}
