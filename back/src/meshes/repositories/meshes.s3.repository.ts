import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { Readable, PassThrough } from 'stream';
import { meshCacheManager } from '../../common/utils/mesh-cache-manager';
import { promisify } from 'util';
import * as fs from 'fs';
import {
  S3UploadFailedException,
  S3DownloadFailedException,
  FileNotFoundException,
} from '../../common/exceptions/storage-exceptions';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class MeshesS3Repository {
  private readonly s3: AWS.S3;
  public readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'), // process.env.AWS_S3_ACCESS_KEY
      secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
      region: this.configService.get('AWS_S3_REGION'), // minio에선 사실 필요 없음
      // 아래 셋은 minio를 사용할 때 필요
      // endpoint: this.configService.get('AWS_S3_ENDPOINT'),
      // s3ForcePathStyle: true,
      // signatureVersion: 'v4',
    });
    this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME'); // nest-s3
  }

  async uploadMesh(file: Express.Multer.File): Promise<string> {
    try {
      const objectKey = `meshes/${Date.now()}_${file.originalname}`.replace(
        / /g,
        '',
      );
      const fileStream = createReadStream(file.path);
      const params = {
        Bucket: this.bucketName,
        Key: objectKey,
        Body: fileStream,
        ContentType: file.mimetype,
      };
      const result = await this.s3.upload(params).promise();
      // s3 업로드 후 로컬 파일 삭제
      await unlinkAsync(file.path);
      return result.Key;
    } catch (error) {
      try {
        await unlinkAsync(file.path);
      } catch (unlinkError) {
        console.error('Failed to delete local file:', unlinkError);
      }
      throw new S3UploadFailedException(
        `File upload failed : ${error.message}`,
      );
    }
  }

  async downloadMesh(objectKey: string): Promise<Readable> {
    try {
      // 먼저 캐시에서 확인
      const cachedData = meshCacheManager.get(objectKey);
      if (cachedData) {
        console.log(`Cache hit for ${objectKey}`);
        return cachedData;
      }

      console.log(`Cache miss for ${objectKey}, downloading from S3`);
      // 캐시에 없으면 S3에서 다운로드
      const params = {
        Bucket: this.bucketName,
        Key: objectKey,
      };
      const passThrough = new PassThrough();
      const s3Stream = this.s3.getObject(params).createReadStream();
      s3Stream.pipe(passThrough);

      // 캐시에 저장
      meshCacheManager.add(objectKey, s3Stream.pipe(new PassThrough()));

      return passThrough;
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        throw new FileNotFoundException(`File not found: ${objectKey}`);
      }
      throw new S3DownloadFailedException(
        `File download failed: ${error.message}`,
      );
    }
  }

  async deleteMesh(objectKey: string): Promise<void> {
    const params = {
      Bucket: this.bucketName,
      Key: objectKey,
    };
    await this.s3.deleteObject(params).promise();
  }

  async checkFileExists(objectKey: string): Promise<boolean> {
    try {
      await this.s3
        .headObject({
          Bucket: this.bucketName,
          Key: objectKey,
        })
        .promise();
      return true;
    } catch (error) {
      if (error.code === 'NotFound') {
        return false;
      }
      throw error;
    }
  }
}
