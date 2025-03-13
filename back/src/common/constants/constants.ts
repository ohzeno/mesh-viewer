import { HttpStatus } from '@nestjs/common';

export const DEFAULT_MAX_CACHE_SIZE = 500 * 1024 * 1024; // 500MB

export const errorToStatusCode = {
  DuplicateFileException: HttpStatus.CONFLICT,
  FileNotFoundException: HttpStatus.NOT_FOUND,
  S3UploadFailedException: HttpStatus.INTERNAL_SERVER_ERROR,
  S3DownloadFailedException: HttpStatus.INTERNAL_SERVER_ERROR,
  StorageOperationFailedException: HttpStatus.INTERNAL_SERVER_ERROR,
};
