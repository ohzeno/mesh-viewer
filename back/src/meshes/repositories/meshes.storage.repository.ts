import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MeshesS3Repository } from './meshes.s3.repository';
import { MeshesMongoDBRepository } from './meshes.mongodb.repository';
import { CreateMeshDto } from '../dtos/create-mesh.dto';
import { ReadOnlyMeshDto } from '../dtos/readonly-mesh.dto';
import {
  DuplicateFileException,
  FileNotFoundException,
  StorageOperationFailedException,
  S3UploadFailedException,
  S3DownloadFailedException,
} from '../../common/exceptions/storage-exceptions';

@Injectable()
export class MeshesStorageRepository {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly meshesS3Repository: MeshesS3Repository,
    private readonly meshesMongoDBRepository: MeshesMongoDBRepository,
  ) {}

  async uploadMesh(
    file: Express.Multer.File,
    contentHash: string,
  ): Promise<ReadOnlyMeshDto> {
    const isDuplicate =
      await this.meshesMongoDBRepository.existsByHash(contentHash);
    if (isDuplicate) {
      throw new DuplicateFileException('Duplicate file');
    }
    const session = await this.connection.startSession();
    session.startTransaction();
    let objectKey: string | null = null;
    // 임시 트랜잭션.
    try {
      objectKey = await this.meshesS3Repository.uploadMesh(file);
      const [fileName, fileExt] = file.originalname.split(/\.(?=[^\.]+$)/);
      const meshData: CreateMeshDto = {
        fileName,
        fileType: fileExt,
        objectKey,
        fileSize: file.size,
        contentHash,
      };
      const result = await this.meshesMongoDBRepository.uploadMeshData(
        meshData,
        session,
      );
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      // S3에 업로드된 파일 삭제
      if (objectKey) {
        await this.meshesS3Repository.deleteMesh(error.objectKey);
      }
      if (error instanceof S3UploadFailedException) throw error;
      throw new StorageOperationFailedException(
        `Upload failed: ${error.message}`,
      );
    } finally {
      session.endSession();
    }
  }

  async getMeshList(): Promise<ReadOnlyMeshDto[]> {
    try {
      return await this.meshesMongoDBRepository.getMeshList();
    } catch (error) {
      throw new StorageOperationFailedException(
        `Failed to get mesh list: ${error.message}`,
      );
    }
  }

  async getMesh(meshId: string) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { objectKey, fileType } =
        await this.meshesMongoDBRepository.getMeshObjectKey(meshId);
      const fileExists =
        await this.meshesS3Repository.checkFileExists(objectKey);

      if (!fileExists) {
        await this.meshesMongoDBRepository.deleteMeshById(meshId, session);
        await session.commitTransaction();
        throw new FileNotFoundException('File not found in storage');
      }
      const fileStream = await this.meshesS3Repository.downloadMesh(objectKey);
      await session.commitTransaction();
      return { fileStream, fileType };
    } catch (error) {
      if (session.inTransaction()) await session.abortTransaction();
      if (error instanceof FileNotFoundException) throw error;
      if (error instanceof S3DownloadFailedException) throw error;
      throw new StorageOperationFailedException(
        `Failed to retrieve mesh: ${error.message}`,
      );
    } finally {
      session.endSession();
    }
  }
}
