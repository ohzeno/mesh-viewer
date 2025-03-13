import { DEFAULT_MAX_CACHE_SIZE } from "../constants";
import { formatFileSize } from "./fileUtils";

class MeshCacheManager {
  private cache: Map<string, ArrayBuffer>;
  private cacheSize: number;
  private meshInfoMap: Map<string, { size: number; lastAccessed: number }>;
  private maxCacheSize: number;

  constructor(maxCacheSize: number = DEFAULT_MAX_CACHE_SIZE) {
    this.cache = new Map();
    this.cacheSize = 0;
    this.meshInfoMap = new Map();
    this.maxCacheSize = maxCacheSize;
  }

  add(mesh: ReadOnlyMesh, data: ArrayBuffer): void {
    // 새 메시를 추가하기 전에 캐시 정리
    while (
      this.cacheSize + data.byteLength > this.maxCacheSize &&
      this.cache.size > 0
    ) {
      this.removeOldest();
    }

    // 단일 메시가 캐시 크기를 초과하는 경우에도 일단 저장
    this.cache.set(mesh.id, data);
    this.meshInfoMap.set(mesh.id, {
      size: data.byteLength,
      lastAccessed: Date.now(),
    });
    this.cacheSize += data.byteLength;

    console.log(
      `Added mesh ${mesh.id} to cache. Current cache size: ${formatFileSize(
        this.cacheSize
      )} MB`
    );
    this.checkMemoryUsage();
  }

  get(meshId: string): ArrayBuffer | undefined {
    const data = this.cache.get(meshId);
    if (data) {
      this.meshInfoMap.get(meshId)!.lastAccessed = Date.now();
    }
    return data;
  }

  private removeOldest(): void {
    let oldestId = "";
    let oldestTime = Infinity;

    Array.from(this.meshInfoMap.entries()).forEach(([id, info]) => {
      if (info.lastAccessed < oldestTime) {
        oldestId = id;
        oldestTime = info.lastAccessed;
      }
    });

    if (oldestId) {
      const removedSize = this.meshInfoMap.get(oldestId)!.size;
      this.cache.delete(oldestId);
      this.meshInfoMap.delete(oldestId);
      this.cacheSize -= removedSize;
      console.log(
        `Removed mesh ${oldestId} from cache. Freed up ${formatFileSize(
          removedSize
        )} MB`
      );
    }
  }

  clear(): void {
    this.cache.clear();
    this.meshInfoMap.clear();
    this.cacheSize = 0;
    console.log("Cache cleared");
  }

  setMaxCacheSize(newSize: number): void {
    this.maxCacheSize = newSize;
    console.log(`Max cache size set to ${formatFileSize(newSize)} MB`);
    while (this.cacheSize > this.maxCacheSize && this.cache.size > 0) {
      this.removeOldest();
    }
  }

  private checkMemoryUsage(): void {
    const performanceWithMemory = performance as Performance;
    if (performanceWithMemory.memory) {
      const { usedJSHeapSize, jsHeapSizeLimit } = performanceWithMemory.memory;
      const usageRatio = usedJSHeapSize / jsHeapSizeLimit;

      console.log(`Memory usage: ${(usageRatio * 100).toFixed(2)}%`);

      if (usageRatio > 0.9) {
        console.warn(
          "High memory usage detected. Consider clearing the cache or reducing max cache size."
        );
        // 자동으로 캐시 정리
        this.clear();
      }
    } else {
      console.log("Memory usage information is not available in this browser.");
    }
  }
}

export const meshCacheManager = new MeshCacheManager();
