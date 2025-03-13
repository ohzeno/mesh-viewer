export class DuplicateFileException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateFileException';
  }
}

export class FileNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileNotFoundException';
  }
}

export class StorageOperationFailedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageOperationFailedException';
  }
}

export class S3UploadFailedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'S3UploadFailedException';
  }
}

export class S3DownloadFailedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'S3DownloadFailedException';
  }
}
