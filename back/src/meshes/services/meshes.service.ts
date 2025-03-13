import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { MeshesStorageRepository } from '../repositories/meshes.storage.repository';
import { ReadOnlyMeshDto } from '../dtos/readonly-mesh.dto';

@Injectable()
export class MeshesService {
  constructor(
    private readonly meshesStorageRepository: MeshesStorageRepository,
  ) {}

  private isValidFile(file: Express.Multer.File): {
    valid: boolean;
    message: string;
  } {
    const allowedExtensions = ['ply', 'stl', 'obj', 'off'];
    const fileExt = file.originalname.split('.').pop();
    // console.log('validate', file, fileExt);
    if (!allowedExtensions.includes(fileExt))
      return { valid: false, message: 'Invalid file extension' };

    const fileDescriptor = fs.openSync(file.path, 'r'); // 파일을 열고, 파일 디스크립터를 반환. 메모리에 파일을 로드하지 않음
    const bufferSize = 256; // 충분한 크기로 설정
    const buffer = Buffer.alloc(bufferSize); // 메모리에 버퍼를 할당
    fs.readSync(fileDescriptor, buffer, 0, bufferSize, 0); // 파일을 읽고, 버퍼에 저장
    fs.closeSync(fileDescriptor); // 파일 디스크립터를 닫음

    const headerString = buffer.toString('ascii', 0, bufferSize); // 버퍼를 문자열로 변환
    // console.log('header', headerString);

    // 임시 검증 로직. 당연히 불완전함.
    switch (fileExt) {
      case 'ply':
        if (
          headerString.startsWith('ply') &&
          file.mimetype === 'application/octet-stream'
        ) {
          return { valid: true, message: 'valid ply file' };
        }
        return { valid: false, message: 'Invalid ply file' };
      case 'stl':
        if (
          // headerString.startsWith('solid') &&
          file.mimetype === 'application/vnd.ms-pki.stl' ||
          file.mimetype === 'application/octet-stream'
        ) {
          return { valid: true, message: 'valid stl file' };
        }
        return { valid: false, message: 'Invalid stl file' };
      // return { valid: true, message: 'valid stl file' };
      case 'obj':
        if (
          (headerString.includes('v ') ||
            headerString.includes('vt ') ||
            headerString.includes('vn ')) &&
          (file.mimetype === 'text/plain' ||
            file.mimetype === 'application/octet-stream')
        ) {
          return { valid: true, message: 'valid obj file' };
        }
        return { valid: false, message: 'Invalid obj file' };
      case 'off':
        if (
          headerString.startsWith('OFF') &&
          (file.mimetype === 'text/plain' ||
            file.mimetype === 'application/octet-stream')
        ) {
          return { valid: true, message: 'valid off file' };
        }
        return { valid: false, message: 'Invalid off file' };
      default:
        return { valid: false, message: 'Invalid file' };
    }
  }

  private calcDynamicPartialHash(filePath: string): string {
    const sampleSize = 1024 * 100; // 100KB
    const fileStats = fs.statSync(filePath);
    const fileSize = fileStats.size;
    const hash = crypto.createHash('sha256');

    if (fileSize <= sampleSize) {
      // 파일 전체를 읽어 해시 계산
      const fileBuffer = fs.readFileSync(filePath);
      hash.update(fileBuffer);
    } else {
      let positions: number[];
      if (fileSize <= sampleSize * 2) {
        // 파일의 시작, 끝 부분에서 샘플링하여 해시 계산
        positions = [0, fileSize - sampleSize];
      } else {
        // 파일의 시작, 중간, 끝 부분에서 샘플링하여 해시 계산
        positions = [
          0,
          Math.floor(fileSize / 2) - sampleSize / 2,
          fileSize - sampleSize,
        ];
      }
      const fileDescriptor = fs.openSync(filePath, 'r');
      positions.forEach((position) => {
        const buffer = Buffer.alloc(sampleSize);
        fs.readSync(fileDescriptor, buffer, 0, sampleSize, position);
        hash.update(buffer); // 데이터 추가
      });
      fs.closeSync(fileDescriptor);
    }

    return hash.digest('hex'); // 최종 해시값 반환
  }

  async uploadFile(file: Express.Multer.File): Promise<ReadOnlyMeshDto> {
    const { valid, message } = this.isValidFile(file);
    if (!valid) {
      throw new Error(message);
    }
    const contentHash = this.calcDynamicPartialHash(file.path);
    return await this.meshesStorageRepository.uploadMesh(file, contentHash);
  }

  async getMeshList(): Promise<ReadOnlyMeshDto[]> {
    return await this.meshesStorageRepository.getMeshList();
  }

  async getMesh(meshId: string) {
    const { fileStream, fileType } =
      await this.meshesStorageRepository.getMesh(meshId);
    return { fileStream, mimeType: this.getMimeType(fileType) };
  }

  private getMimeType(extension: string): string {
    switch (extension) {
      case 'stl':
        return 'model/stl';
      case 'obj':
        return 'model/obj';
      case 'ply':
      case 'off':
      default:
        return 'application/octet-stream';
    }
  }
}
