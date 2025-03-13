import { Readable } from 'stream';
import { formatFileSize } from './file-utils';
import * as os from 'os';
import { DEFAULT_MAX_CACHE_SIZE } from '../constants/constants';

class MeshCacheManager {
  private cache: Map<string, Buffer>;
  private cacheSize: number;
  private meshInfoMap: Map<string, { size: number; lastAccessed: number }>;
  private maxCacheSize: number;

  constructor(maxCacheSize: number = DEFAULT_MAX_CACHE_SIZE) {
    this.cache = new Map();
    this.cacheSize = 0;
    this.meshInfoMap = new Map();
    this.maxCacheSize = maxCacheSize;
  }

  async add(meshId: string, data: Readable): Promise<void> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      data.on('data', (chunk) => chunks.push(chunk));
      data.on('end', () => {
        const buffer = Buffer.concat(chunks);

        // 새 메시를 추가하기 전에 캐시 정리
        while (
          this.cacheSize + buffer.length > this.maxCacheSize &&
          this.cache.size > 0
        ) {
          this.removeOldest();
        }

        this.cache.set(meshId, buffer);
        this.meshInfoMap.set(meshId, {
          size: buffer.length,
          lastAccessed: Date.now(),
        });
        this.cacheSize += buffer.length;

        console.log(
          `Added mesh ${meshId} to cache. Current cache size: ${formatFileSize(
            this.cacheSize,
          )} MB`,
        );
        this.checkMemoryUsage();
        resolve();
      });
      data.on('error', reject);
    });
  }

  get(meshId: string): Readable | undefined {
    const data = this.cache.get(meshId);
    if (data) {
      this.meshInfoMap.get(meshId)!.lastAccessed = Date.now();
      this.checkMemoryUsage();
      return Readable.from(data);
    }
    return undefined;
  }

  private removeOldest(): void {
    let oldestId = '';
    let oldestTime = Infinity;

    for (const [id, info] of this.meshInfoMap.entries()) {
      if (info.lastAccessed < oldestTime) {
        oldestId = id;
        oldestTime = info.lastAccessed;
      }
    }

    if (oldestId) {
      const removedSize = this.meshInfoMap.get(oldestId)!.size;
      this.cache.delete(oldestId);
      this.meshInfoMap.delete(oldestId);
      this.cacheSize -= removedSize;
      console.log(
        `Removed mesh ${oldestId} from cache. Freed up ${formatFileSize(
          removedSize,
        )} MB`,
      );
    }
  }

  clear(): void {
    this.cache.clear();
    this.meshInfoMap.clear();
    this.cacheSize = 0;
    console.log('Cache cleared');
  }

  setMaxCacheSize(newSize: number): void {
    this.maxCacheSize = newSize;
    console.log(`Max cache size set to ${formatFileSize(newSize)} MB`);
    while (this.cacheSize > this.maxCacheSize && this.cache.size > 0) {
      this.removeOldest();
    }
  }

  private checkMemoryUsage(): void {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsageRatio = usedMemory / totalMemory;

    console.log(`Memory usage: ${(memoryUsageRatio * 100).toFixed(2)}%`);
    console.log(`Cache size: ${formatFileSize(this.cacheSize)} MB`);

    if (memoryUsageRatio > 0.9 || this.cacheSize > this.maxCacheSize * 0.9) {
      console.warn(
        'High memory usage or cache size detected. Clearing half of the cache.',
      );
      this.clearHalf();
    }
  }

  private clearHalf(): void {
    // half라곤 했지만 일단은 그냥 갯수 절반 클리어임
    const sortedMeshes = Array.from(this.meshInfoMap.entries()).sort(
      (a, b) => a[1].lastAccessed - b[1].lastAccessed,
    );

    const halfLength = Math.floor(sortedMeshes.length / 2);
    for (let i = 0; i < halfLength; i++) {
      const [meshId, info] = sortedMeshes[i];
      this.cache.delete(meshId);
      this.meshInfoMap.delete(meshId);
      this.cacheSize -= info.size;
    }

    console.log(
      `Cleared half of the cache. New cache size: ${formatFileSize(
        this.cacheSize,
      )} MB`,
    );
  }
}

export const meshCacheManager = new MeshCacheManager();
